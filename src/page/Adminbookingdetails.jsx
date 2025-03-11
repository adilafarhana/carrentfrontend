import React, { useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.post("http://localhost:3030/getbooking", {}, requestHeader);
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
      const response = await axios.post("http://localhost:3030/updateOrderStatus", { id, status }, requestHeader);
      if (response.status === 200) {
        alert("Booking status updated successfully!");
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === id ? { ...booking, status, startTime: response.data.booking.startTime } : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <p className="text-center">Loading bookings...</p>;
  if (errorMessage) return <p className="text-center text-danger">{errorMessage}</p>;

  const rentBookings = bookings.filter((booking) => booking?.car?.type === "Rent");
  const usedBookings = bookings.filter((booking) => booking?.car?.type === "Used");

  const renderBookingsTable = (bookingsList, title) => (
    <div className="mt-4">
      <h3 className="text-center">{title}</h3>
      {bookingsList.length === 0 ? (
        <p className="text-center">No {title.toLowerCase()} bookings found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Car</th>
              <th>Booking Date</th>
              <th>Duration</th>
              <th>Total Price</th>
              <th>Start Time</th>
              <th>Payment Details</th> {/* New column for payment details */}
              <th>Images</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingsList.map((booking, index) => (
              <tr key={index}>
                <td>{booking?.car?.type || "N/A"}</td>
                <td>{booking?.user?.name || "N/A"}</td>
                <td>{booking?.user?.email || "N/A"}</td>
                <td>{booking?.user?.phone || "N/A"}</td>
                <td>{booking?.user?.address || "N/A"}</td>
                <td>{booking?.car?.brand} {booking?.car?.model}</td>
                <td>{booking?.date}</td>
                <td>{booking?.duration} hours</td>
                <td>₹{booking?.totalPrice}</td>
                <td>{booking?.startTime ? new Date(booking.startTime).toLocaleString() : "N/A"}</td>
                <td>
                  {booking.payment ? (
                    <div>
                      <p><strong>Payment ID:</strong> {booking.payment.paymentId}</p>
                      <p><strong>Amount:</strong> ₹{booking.payment.amount}</p>
                      <p><strong>Status:</strong> {booking.payment.status}</p>
                    </div>
                  ) : (
                    <p>No payment details available.</p>
                  )}
                </td>
                <td>
                  {booking.images?.length > 0 ? (
                    booking.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:3030${image}`}
                        alt={`Booking Image ${idx + 1}`}
                        style={{ width: "100px", height: "auto", margin: "5px" }}
                      />
                    ))
                  ) : (
                    <p>No images available.</p>
                  )}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => updateStatus(booking._id, booking.status)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Bookings</h2>
      {renderBookingsTable(rentBookings, "Rental Car Bookings")}
      {renderBookingsTable(usedBookings, "Used Car Bookings")}
    </div>
  );
};

export default Adminbookingdetails;