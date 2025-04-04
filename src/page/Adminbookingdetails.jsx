import React, { useEffect, useState } from "react";
import axios from "axios";
import Navadmindashboard from "./Nav/Navadmindashboard";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

const Adminbookingdetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  // Styles
  const styles = {
    container: {
      padding: "2rem",
      marginTop: "5rem",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: "2rem",
      fontSize: "2rem",
      fontWeight: "600",
      color: "#2c3e50",
    },
    section: {
      marginBottom: "3rem",
      backgroundColor: "#ffffff",
      padding: "2rem",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#3498db",
      marginBottom: "1.5rem",
    },
    noData: {
      textAlign: "center",
      color: "#7f8c8d",
      fontSize: "1.1rem",
      padding: "2rem",
    },
    cardsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "1.5rem",
      marginTop: "1.5rem",
    },
    card: {
      border: "1px solid #e0e0e0",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      },
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    cardItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 0",
      borderBottom: "1px solid #f0f0f0",
    },
    cardLabel: {
      fontWeight: "600",
      color: "#2c3e50",
      minWidth: "150px",
    },
    cardValue: {
      color: "#34495e",
      textAlign: "right",
      flex: 1,
    },
    balanceAmount: {
      color: "#e74c3c",
      fontWeight: "600",
    },
    select: {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #ced4da",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      width: "100%",
      fontSize: "0.9rem",
      marginTop: "0.5rem",
    },
    button: {
      padding: "0.75rem 1rem",
      borderRadius: "0.25rem",
      backgroundColor: "#3498db",
      color: "#ffffff",
      border: "none",
      cursor: "pointer",
      marginTop: "1rem",
      width: "100%",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#2980b9",
      },
    },
    returnButton: {
      backgroundColor: "#17a2b8",
      "&:hover": {
        backgroundColor: "#138496",
      },
    },
    imagesContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "0.5rem",
    },
    image: {
      width: "80px",
      height: "60px",
      borderRadius: "0.25rem",
      objectFit: "cover",
      border: "1px solid #ddd",
    },
    uploadedCarsButton: {
      display: "inline-block",
      padding: "0.5rem 1rem",
      backgroundColor: "#28a745",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "0.25rem",
      fontWeight: "500",
      fontSize: "0.9rem",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#218838",
      },
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    },
    error: {
      color: "#e74c3c",
      textAlign: "center",
      marginTop: "2rem",
      fontSize: "1.1rem",
      backgroundColor: "#fadbd8",
      padding: "1rem",
      borderRadius: "0.25rem",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  };

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Function to format datetime as dd/mm/yyyy hh:mm
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post(
          "https://carrentbackend-1-tpmm.onrender.com/getbooking", 
          {}, 
          requestHeader
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setBookings(response.data);
        } else {
          setErrorMessage("No bookings available.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setErrorMessage("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.post(
        "https://carrentbackend-1-tpmm.onrender.com/updateOrderStatus",
        { id, status },
        requestHeader
      );

      if (response.status === 200 && response.data?.booking) {
        alert("Booking status updated successfully!");

        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === id
              ? { ...booking, status, startTime: response.data.booking.startTime }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <ClipLoader color="#3498db" size={50} />
        <p style={{ marginTop: "1rem", color: "#7f8c8d" }}>Loading bookings...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={styles.container}>
        <Navadmindashboard />
        <div style={styles.error}>{errorMessage}</div>
      </div>
    );
  }

  const rentBookings = bookings.filter((booking) => booking?.car?.type === "Rent");
  const usedBookings = bookings.filter((booking) => booking?.car?.type === "Used");

  const renderBookingsTable = (bookingsList, title) => (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      {bookingsList.length === 0 ? (
        <p style={styles.noData}>No {title.toLowerCase()} found.</p>
      ) : (
        <div style={styles.cardsContainer}>
          {bookingsList.map((booking, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardContent}>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Type:</span>
                  <span style={styles.cardValue}>{booking?.car?.type || "N/A"}</span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>User Name:</span>
                  <span style={styles.cardValue}>{booking?.user?.name || "N/A"}</span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Email:</span>
                  <span style={styles.cardValue}>{booking?.user?.email || "N/A"}</span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Address:</span>
                  <span style={styles.cardValue}>{booking?.address || "N/A"}</span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Phone:</span>
                  <span style={styles.cardValue}>{booking?.phone || "N/A"}</span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Car:</span>
                  <span style={styles.cardValue}>
                    {booking?.car?.brand} {booking?.car?.model}
                  </span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Booking Date:</span>
                  <span style={styles.cardValue}>{formatDate(booking?.date)}</span>
                </div>
                <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Booking Time:</span>
                  <span style={styles.cardValue}>{booking?.time || "N/A"}</span>
                </div>
                {booking?.car?.type === "Rent" && ( <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Total Price:</span>
                  <span style={styles.cardValue}>₹{booking?.totalPrice || 0}</span>
                </div>)}
                {booking?.car?.type === "Rent" && (<div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Advance Payment:</span>
                  <span style={styles.cardValue}>₹{booking?.advancePayment || 0}</span>
                </div>)}
                {booking?.car?.type === "Rent" && ( <div style={styles.cardItem}>
                  <span style={styles.cardLabel}>Balance Amount:</span>
                  <span style={{ ...styles.cardValue, ...styles.balanceAmount }}>
                    ₹{booking?.totalPrice - (booking?.advancePayment || 0)}
                  </span>
                </div>)}
                {booking.startTime && (
                  <div style={styles.cardItem}>
                    <span style={styles.cardLabel}>Rental Start Time:</span>
                    <span style={styles.cardValue}>{formatDateTime(booking.startTime)}</span>
                  </div>
                )}
                <div>
                  <div style={styles.cardLabel}>Images:</div>
                  {booking.images?.length > 0 ? (
                    <div style={styles.imagesContainer}>
                      {booking.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={`https://carrentbackend-1-tpmm.onrender.com${image}`}
                          alt={`Booking Image ${idx + 1}`}
                          style={styles.image}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>No images available</p>
                  )}
                </div>

                <div>
                  <div style={styles.cardLabel}>Status:</div>
                  <select
                    style={styles.select}
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button 
                  style={styles.button} 
                  onClick={() => updateStatus(booking._id, booking.status)}
                >
                  Update Status
                </button>

                {booking?.car?.type === "Rent" && (
                  <button
                    style={{ ...styles.button, ...styles.returnButton }}
                    onClick={() => navigate("/ReturnCar", {
                      state: {
                        bookingData: booking
                      }
                    })}
                  >
                    Return Car
                  </button>
                )}

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Link 
                    to={`/admin/uploaded-cars?carId=${booking?.car?._id}`} 
                    style={styles.uploadedCarsButton}
                  >
                    Change Car Status
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Navadmindashboard />
      <div style={styles.container}>
        <h2 style={styles.heading}>Booking Management</h2>
        {renderBookingsTable(rentBookings, "Rental Car Bookings")}
        {renderBookingsTable(usedBookings, "Used Car Bookings")}
      </div>
    </div>
  );
};

export default Adminbookingdetails;