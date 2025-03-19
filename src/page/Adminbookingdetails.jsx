import React, { useEffect, useState } from "react";
import axios from "axios";
import Navadmindashboard from "./Nav/Navadmindashboard";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";

const Adminbookingdetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post("https://carrentbackend-1-tpmm.onrender.com/getbooking", {}, requestHeader);
        console.log("Bookings response:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setBookings(response.data);
        } else {
          setErrorMessage("No bookings available.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setErrorMessage("Failed to fetch bookings.");
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

      console.log("API Response:", response.data);

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
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <ClipLoader color="#007bff" size={50} />
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (errorMessage) {
    return <p style={styles.error}>{errorMessage}</p>;
  }

  const rentBookings = bookings.filter((booking) => booking?.car?.type === "Rent");
  const usedBookings = bookings.filter((booking) => booking?.car?.type === "Used");

  const renderBookingsTable = (bookingsList, title) => (
    <div style={styles.section}>
      <Navadmindashboard />
      <h3 style={styles.sectionTitle}>{title}</h3>
      <br />
      <h1>CAR BOOKING DETAILS</h1>

      {bookingsList.length === 0 ? (
        <p style={styles.noData}>No {title.toLowerCase()} bookings found.</p>
      ) : (
        <div style={styles.cardsContainer}>
          {bookingsList.map((booking, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardContent}>
                <div><strong>Type:</strong> {booking?.car?.type || "N/A"}</div>
                <div><strong>User Name:</strong> {booking?.user?.name || "N/A"}</div>
                <div><strong>Email:</strong> {booking?.user?.email || "N/A"}</div>
                <div><strong>Address:</strong> {booking?.address || "N/A"}</div>
                <div><strong>Phone:</strong> {booking?.phone || "N/A"}</div>
                <div><strong>Car:</strong> {booking?.car?.brand} {booking?.car?.model}</div>
                <div><strong>Booking Date:</strong> {booking?.date}</div>
                <div><strong>Total Price:</strong> ₹{booking?.totalPrice}</div>
                <div><strong>Advance Payment:</strong> ₹{booking?.advancePayment || 0}</div>
 <div>
                  <strong>Images:</strong>
                  {booking.images?.length > 0 ? (
                    <div style={styles.imagesContainer}>
                      {booking.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={`https://carrentbackend-1-tpmm.onrender.com/${image}`}
                          alt={`Booking Image ${idx + 1}`}
                          style={styles.image}
                        />
                      ))}
                    </div>
                  ) : (
                    <p>No images available.</p>
                  )}
                </div>


                <div>
                  <strong>Status:</strong>
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

                <button style={styles.button} onClick={() => updateStatus(booking._id, booking.status)}>
                  Update
                </button>

                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Link to={`/uploadcar?carId=${booking?.car?._id}`} style={styles.uploadedCarsButton}>
change car status                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Bookings</h2>
      {renderBookingsTable(rentBookings, "Rental Car Bookings")}
      {renderBookingsTable(usedBookings, "Used Car Bookings")}
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  heading: { textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" },
  sectionTitle: { textAlign: "center", fontSize: "20px", fontWeight: "bold" },
  noData: { textAlign: "center", color: "gray" },
  cardsContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" },
  card: { border: "1px solid #ddd", borderRadius: "8px", padding: "20px", maxWidth: "600px", margin: "10px auto", backgroundColor: "#fff" },
  select: { padding: "5px", borderRadius: "4px", marginLeft: "10px" },
  button: { padding: "8px 12px", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", marginTop: "10px" },
  image: {
    width: "100px",
    height: "auto",
    borderRadius: "4px",
  },
  uploadedCarsButton: { display: "inline-block", padding: "8px 12px", backgroundColor: "#28a745", color: "white", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" },
};

export default Adminbookingdetails;
