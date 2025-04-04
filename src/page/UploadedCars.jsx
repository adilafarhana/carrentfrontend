import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UploadedCars = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carsResponse, bookingsResponse] = await Promise.all([
        axios.get("https://carrentbackend-1-tpmm.onrender.com/getcars", requestHeader),
        axios.post("https://carrentbackend-1-tpmm.onrender.com/getbooking", {}, requestHeader)
      ]);
      
      setCars(carsResponse.data);
      setBookings(bookingsResponse.data);
      updateCarStatusesAutomatically(carsResponse.data, bookingsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCarStatusesAutomatically = (carsData, bookingsData) => {
    const updatedCars = carsData.map(car => {
      const activeBookings = bookingsData.filter(booking => 
        booking.car?._id === car._id && 
        !["Returned", "Cancelled"].includes(booking.status));
      
      const newStatus = activeBookings.length > 0 ? "Not Available" : "Available";
      
      if (car.status !== newStatus) {
        axios.put(
          `https://carrentbackend-1-tpmm.onrender.com/updatestatus/${car._id}`,
          { status: newStatus },
          requestHeader
        ).catch(err => console.error("Error updating car status:", err));
        
        return { ...car, status: newStatus };
      }
      return car;
    });
  
    setCars(updatedCars);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (carId) => {
    try {
      const response = await axios.delete(
        `https://carrentbackend-1-tpmm.onrender.com/deletecar/${carId}`,
        requestHeader
      );
      alert(response.data.message);
      fetchData();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert(`Error deleting car: ${error.response?.data?.message || error.message}`);
    }
  };

  const manualOverrideStatus = async (carId, newStatus) => {
    try {
      await axios.put(
        `https://carrentbackend-1-tpmm.onrender.com/updatestatus/${carId}`,
        { status: newStatus },
        requestHeader
      );
      alert(`Car status manually set to ${newStatus}`);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status.");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        Uploaded Cars (Automated Availability)
      </h2>
      
      <div style={styles.buttonGroup}>
        <button
          onClick={() => navigate("/uploadcar")}
          style={styles.backButton}
        >
          Go Back to Upload Page
        </button>
        <button
          onClick={fetchData}
          style={styles.refreshButton}
        >
          Refresh Data
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Brand</th>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Rental Price</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
              <th style={styles.th}>History</th>
            </tr>
          </thead>
          <tbody>
            {cars.length > 0 ? (
              cars.map((car) => (
                <tr key={car._id} style={styles.tableRow}>
                  <td style={styles.td}>{car.brand}</td>
                  <td style={styles.td}>{car.model}</td>
                  <td style={styles.td}>{car.price} USD</td>
                  <td style={styles.td}>
                    {car.type === "Rent" ? `${car.rentalPricePerHour} USD/hour` : "N/A"}
                  </td>
                  <td style={styles.td}>{car.type}</td>
                  <td style={{
                    ...styles.td,
                    color: car.status === "Available" ? "#28a745" : "#dc3545",
                    fontWeight: "bold"
                  }}>
                    {car.status}
                    {car.status === "Not Available" && (
                      <div style={styles.statusSubtext}>(Active booking exists)</div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleDelete(car._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => manualOverrideStatus(
                          car._id, 
                          car.status === "Available" ? "Not Available" : "Available"
                        )}
                        style={{
                          ...styles.toggleButton,
                          backgroundColor: car.status === "Available" ? "#ffc107" : "#28a745",
                          color: car.status === "Available" ? "#212529" : "#fff"
                        }}
                      >
                        {car.status === "Available" ? "Mark Unavailable" : "Make Available"}
                      </button>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <Link 
                      to={`/car-booking-history/${car._id}`}
                      style={styles.historyButton}
                    >
                      View Bookings
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={styles.noDataCell}>
                  No cars uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.infoAlert}>
        <h4 style={styles.alertHeading}>System Information</h4>
        <p style={styles.alertText}>
          <strong>Automated Availability:</strong> Car status is automatically updated based on active bookings.
          "Not Available" means the car is currently booked or in use.
        </p>
        <p style={styles.alertText}>
          <strong>Manual Override:</strong> You can manually change availability status if needed.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: "center",
    fontSize: "28px",
    color: "#343a40",
    marginBottom: "25px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    justifyContent: "center"
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#5a6268"
    }
  },
  refreshButton: {
    padding: "10px 20px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#138496"
    }
  },
  tableContainer: {
    overflowX: "auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    backgroundColor: "#fff",
    marginBottom: "30px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px"
  },
  tableHeader: {
    backgroundColor: "#343a40",
    color: "#fff"
  },
  th: {
    padding: "15px",
    textAlign: "left",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  tableRow: {
    borderBottom: "1px solid #dee2e6",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "#f8f9fa"
    }
  },
  td: {
    padding: "15px",
    verticalAlign: "middle"
  },
  statusSubtext: {
    fontSize: "12px",
    color: "#6c757d",
    marginTop: "3px"
  },
  actionButtons: {
    display: "flex",
    gap: "10px"
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#c82333"
    }
  },
  toggleButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      opacity: "0.9"
    }
  },
  historyButton: {
    padding: "6px 12px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#138496"
    }
  },
  noDataCell: {
    textAlign: "center",
    padding: "30px",
    color: "#6c757d",
    fontSize: "16px"
  },
  infoAlert: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
    padding: "20px",
    borderRadius: "4px",
    borderLeft: "5px solid #17a2b8"
  },
  alertHeading: {
    marginTop: "0",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600"
  },
  alertText: {
    marginBottom: "10px",
    lineHeight: "1.5",
    ":last-child": {
      marginBottom: "0"
    }
  }
};

export default UploadedCars;