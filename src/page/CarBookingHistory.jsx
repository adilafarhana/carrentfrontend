import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navadmindashboard from "./Nav/Navadmindashboard";
import { ClipLoader } from "react-spinners";

const CarBookingHistory = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [carBookings, setCarBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeBookings: 0
  });
  const navigate = useNavigate();

  // Internal CSS styles
  const styles = {
    container: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    },
    header: {
      backgroundColor: "#343a40",
      color: "white",
      padding: "20px 0",
      marginBottom: "30px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    card: {
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      marginBottom: "30px",
      border: "none"
    },
    cardHeader: {
      backgroundColor: "#0d6efd",
      color: "white",
      borderRadius: "10px 10px 0 0 !important",
      padding: "15px 20px",
      borderBottom: "none"
    },
    carCard: {
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      overflow: "hidden"
    },
    carCardSelected: {
      transform: "scale(1.02)",
      boxShadow: "0 0 0 2px #0d6efd",
      borderColor: "#0d6efd"
    },
    carImage: {
      height: "180px",
      objectFit: "cover",
      borderBottom: "1px solid #dee2e6"
    },
    table: {
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden"
    },
    tableHeader: {
      backgroundColor: "#343a40",
      color: "white"
    },
    statusBadge: {
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500"
    },
    actionButton: {
      padding: "5px 10px",
      fontSize: "0.85rem",
      borderRadius: "4px"
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "rgba(255,255,255,0.8)"
    },
    errorAlert: {
      maxWidth: "800px",
      margin: "30px auto",
      borderRadius: "8px"
    },
    modal: {
      display: showBookingModal ? 'block' : 'none',
      position: 'fixed',
      zIndex: 1050,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
      backgroundColor: '#fff',
      margin: '5% auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      width: '80%',
      maxWidth: '900px',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    modalHeader: {
      borderBottom: '1px solid #dee2e6',
      paddingBottom: '15px',
      marginBottom: '20px',
      position: 'relative'
    },
    detailRow: {
      display: 'flex',
      marginBottom: '10px',
      flexWrap: 'wrap'
    },
    detailLabel: {
      fontWeight: '600',
      width: '200px',
      color: '#495057',
      minWidth: '150px'
    },
    detailValue: {
      flex: 1,
      wordBreak: 'break-word'
    },
    sectionHeader: {
      backgroundColor: '#f8f9fa',
      padding: '10px 15px',
      margin: '20px 0 10px 0',
      borderRadius: '5px',
      borderLeft: '4px solid #0d6efd'
    },
    statsCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    statsValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0d6efd'
    },
    statsLabel: {
      color: '#6c757d',
      fontSize: '14px'
    }
  };

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carsResponse, bookingsResponse] = await Promise.all([
          axios.get("https://carrentbackend-1-tpmm.onrender.com/getcars", requestHeader),
          axios.post("https://carrentbackend-1-tpmm.onrender.com/getbooking", {}, requestHeader)
        ]);
        
        setCars(carsResponse.data);
        setBookings(bookingsResponse.data);

        // Calculate statistics
        const totalRevenue = bookingsResponse.data.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const totalBookings = bookingsResponse.data.length;
        const activeBookings = bookingsResponse.data.filter(b => 
          ["Confirmed", "Processing", "Ready for Delivery", "Delivered"].includes(b.status)
        ).length;

        setStats({
          totalRevenue,
          totalBookings,
          activeBookings
        });
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCar && bookings.length > 0) {
      const filteredBookings = bookings.filter(
        booking => booking.car?._id === selectedCar._id
      ).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setCarBookings(filteredBookings);
    }
  }, [selectedCar, bookings]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.abs(end - start) / 36e5;
    return `${Math.round(hours)} hours`;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "#6c757d",
      Confirmed: "#0d6efd",
      Processing: "#0dcaf0",
      "Ready for Delivery": "#ffc107",
      Delivered: "#198754",
      Returned: "#212529",
      Cancelled: "#dc3545",
      Overdue: "#dc3545"
    };
    
    return (
      <span style={{
        ...styles.statusBadge,
        backgroundColor: statusColors[status] || '#6c757d'
      }}>
        {status}
      </span>
    );
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const renderBookingDetailsModal = () => {
    if (!selectedBooking) return null;

    const calculateHoursLate = () => {
      if (!selectedBooking.returnTime || !selectedBooking.date || !selectedBooking.duration) return 0;
      
      const expectedReturn = new Date(selectedBooking.date);
      expectedReturn.setHours(expectedReturn.getHours() + (selectedBooking.duration || 24));
      const actualReturn = new Date(selectedBooking.returnTime);
      return Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
    };

    const hoursLate = selectedBooking.status === "Returned" ? calculateHoursLate() : 0;

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3>Booking Details</h3>
            <button 
              onClick={closeModal}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                border: 'none',
                background: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>

          <div style={styles.sectionHeader}>
            <h5>Customer Information</h5>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Full Name:</div>
            <div style={styles.detailValue}>{selectedBooking.fullName}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Email:</div>
            <div style={styles.detailValue}>{selectedBooking.email}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Phone:</div>
            <div style={styles.detailValue}>{selectedBooking.phone}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Address:</div>
            <div style={styles.detailValue}>{selectedBooking.address}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Place:</div>
            <div style={styles.detailValue}>{selectedBooking.place}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Date of Birth:</div>
            <div style={styles.detailValue}>{selectedBooking.dob}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Pincode:</div>
            <div style={styles.detailValue}>{selectedBooking.pincode}</div>
          </div>

          <div style={styles.sectionHeader}>
            <h5>Booking Information</h5>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Booking Date:</div>
            <div style={styles.detailValue}>{formatDate(selectedBooking.date)}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Booking Time:</div>
            <div style={styles.detailValue}>{selectedBooking.time}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Duration:</div>
            <div style={styles.detailValue}>{selectedBooking.duration} hours</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Selected Period:</div>
            <div style={styles.detailValue}>{selectedBooking.selectedPeriod || 'N/A'}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Status:</div>
            <div style={styles.detailValue}>{getStatusBadge(selectedBooking.status)}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Payment Method:</div>
            <div style={styles.detailValue}>{selectedBooking.paymentMethod}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Payment Status:</div>
            <div style={styles.detailValue}>{selectedBooking.paymentStatus}</div>
          </div>

          <div style={styles.sectionHeader}>
            <h5>Car Information</h5>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Car:</div>
            <div style={styles.detailValue}>
              {selectedBooking.car?.brand} {selectedBooking.car?.model} ({selectedBooking.car?.type})
            </div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Car Status:</div>
            <div style={styles.detailValue}>{selectedBooking.car?.status || 'N/A'}</div>
          </div>

          <div style={styles.sectionHeader}>
            <h5>Financial Information</h5>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Total Price:</div>
            <div style={styles.detailValue}>₹{selectedBooking.totalPrice}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Advance Payment:</div>
            <div style={styles.detailValue}>₹{selectedBooking.advancePayment || 0}</div>
          </div>
          <div style={styles.detailRow}>
            <div style={styles.detailLabel}>Balance Amount:</div>
            <div style={styles.detailValue}>₹{selectedBooking.balanceAmount || 0}</div>
          </div>
          {selectedBooking.lateFee > 0 && (
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Late Fee:</div>
              <div style={styles.detailValue}>₹{selectedBooking.lateFee}</div>
            </div>
          )}

          {selectedBooking.status === "Returned" && (
            <>
              <div style={styles.sectionHeader}>
                <h5>Return Information</h5>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Return Time:</div>
                <div style={styles.detailValue}>{formatDate(selectedBooking.returnTime)}</div>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Return Condition:</div>
                <div style={styles.detailValue}>{selectedBooking.returnCondition}</div>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Return Notes:</div>
                <div style={styles.detailValue}>{selectedBooking.returnNotes || 'N/A'}</div>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Hours Late:</div>
                <div style={styles.detailValue}>
                  {hoursLate.toFixed(1)} hours
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button 
              onClick={closeModal}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <ClipLoader color="#0d6efd" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={styles.container}>
        <Navadmindashboard />
        <div className="alert alert-danger" style={styles.errorAlert}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navadmindashboard />
      
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-md-4">
            <div style={styles.statsCard}>
              <div style={styles.statsValue}>{stats.totalBookings}</div>
              <div style={styles.statsLabel}>Total Bookings</div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={styles.statsCard}>
              <div style={styles.statsValue}>₹{stats.totalRevenue.toLocaleString()}</div>
              <div style={styles.statsLabel}>Total Revenue</div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={styles.statsCard}>
              <div style={styles.statsValue}>{stats.activeBookings}</div>
              <div style={styles.statsLabel}>Active Bookings</div>
            </div>
          </div>
        </div>

        <div className="card" style={styles.card}>
          <div className="card-header" style={styles.cardHeader}>
            <h4 className="mb-0">Car Booking Histories</h4>
          </div>
          
          <div className="card-body">
            {/* Car Selection */}
            <div className="mb-4">
              <h5 className="mb-3">Select a Car to View Booking History</h5>
              <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                {cars.map((car) => (
                  <div className="col" key={car._id}>
                    <div 
                      style={{
                        ...styles.carCard,
                        ...(selectedCar?._id === car._id ? styles.carCardSelected : {})
                      }}
                      onClick={() => handleCarSelect(car)}
                    >
                      {car.images?.length > 0 && (
                        <img 
                          src={`https://carrentbackend-1-tpmm.onrender.com${car.images[0]}`} 
                          style={styles.carImage}
                          alt={car.model}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{car.brand} {car.model}</h5>
                        <p className="card-text">
                          <small className="text-muted">
                            {car.type} • {car.status}
                          </small>
                        </p>
                      </div>
                      <div className="card-footer bg-transparent">
                        <small className="text-muted">
                          Total Bookings: {bookings.filter(b => b.car?._id === car._id).length}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking History for Selected Car */}
            {selectedCar && (
              <div className="mt-5">
                <h4 className="mb-4">
                  Booking History for {selectedCar.brand} {selectedCar.model}
                  <span className="badge bg-info ms-2">
                    {carBookings.length} {carBookings.length === 1 ? 'booking' : 'bookings'}
                  </span>
                </h4>

                {carBookings.length === 0 ? (
                  <div className="alert alert-info">
                    No booking history found for this car.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table" style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th>Customer</th>
                          <th>Booking Date</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carBookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>
                              <div>
                                <strong>{booking.fullName}</strong>
                                <div className="text-muted small">{booking.email}</div>
                              </div>
                            </td>
                            <td>
                              {formatDate(booking.date)}
                              {booking.returnTime && (
                                <div className="text-muted small">
                                  Returned: {formatDate(booking.returnTime)}
                                </div>
                              )}
                            </td>
                            <td>
                              {booking.duration ? `${booking.duration} hours` : "N/A"}
                              {booking.returnTime && (
                                <div className="text-muted small">
                                  Actual: {calculateDuration(booking.date, booking.returnTime)}
                                </div>
                              )}
                            </td>
                            <td>
                              {getStatusBadge(booking.status)}
                              {booking.lateFee > 0 && (
                                <div className="text-danger small">
                                  Late fee: ₹{booking.lateFee}
                                </div>
                              )}
                            </td>
                            <td>
                              ₹{booking.totalPrice}
                              {booking.advancePayment > 0 && (
                                <div className="text-success small">
                                  Paid: ₹{booking.advancePayment}
                                </div>
                              )}
                            </td>
                            <td>
                              <button 
                                style={styles.actionButton}
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => handleViewBookingDetails(booking)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {renderBookingDetailsModal()}
    </div>
  );
};

export default CarBookingHistory;