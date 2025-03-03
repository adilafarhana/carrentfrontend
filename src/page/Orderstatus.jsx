import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderStatus = () => {
    const { userId } = useParams(); 

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const requestHeader = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const storedUserId = localStorage.getItem("userId");
                if (!storedUserId) {
                    setErrorMessage("User ID not found. Please log in again.");
                    setLoading(false);
                    return;
                }

                const response = await axios.post(`http://localhost:3030/userBookings/${storedUserId}`, {}, requestHeader);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setBookings(response.data);
                    setErrorMessage("");
                } else {
                    setErrorMessage("No bookings available.");
                }
            } catch (error) {
                console.error("Error fetching user bookings:", error);
                setErrorMessage("Failed to fetch bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();

        const interval = setInterval(() => {
            fetchUserBookings();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <p className="text-center">Loading your bookings...</p>;
    if (errorMessage) return <p className="text-center text-danger">{errorMessage}</p>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Your Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-center">No bookings found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Car</th>
                            <th>Booking Date</th>
                            <th>Duration</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking?.car?.brand} {booking?.car?.model}</td>
                                <td>{booking?.date}</td>
                                <td>{booking?.duration} hours</td>
                                <td>₹{booking?.totalPrice}</td>
                                <td>
                                    <span
                                        className={`badge bg-${booking.status === "Confirmed" ? "success" : booking.status === "Cancelled" ? "danger" : "warning"}`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderStatus;
