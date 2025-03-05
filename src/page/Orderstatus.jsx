import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderStatus = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reviewData, setReviewData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate(); 

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

                const response = await axios.post(
                    `http://localhost:3030/userBookings/${storedUserId}`, {}, requestHeader
                );

                setBookings(response.data || []);
            } catch (error) {
                setErrorMessage("Failed to fetch bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, []);

    const handleReviewChange = (bookingId, field, value) => {
        setReviewData(prev => ({
            ...prev,
            [bookingId]: {
                ...prev[bookingId],
                [field]: value,
            }
        }));
    };

    const submitReview = async (booking) => {
        if (submitting) return; 
        setSubmitting(true);
    
        const { rating, comment } = reviewData[booking._id] || {};
    
        if (!rating || !comment) {
            alert("Please provide both rating and comment.");
            setSubmitting(false);
            return;
        }
    
        const reviewPayload = {
            userId: localStorage.getItem("userId"),
            bookingId: booking._id,
            carId: booking.car._id,
            rating,
            comment
        };
    
        console.log("Sending review:", reviewPayload);  // Debugging log
    
        try {
            await axios.post(
                "http://localhost:3030/addReview",
                reviewPayload,
                requestHeader
            );
    
            alert("Review submitted successfully!");
        navigate(`/car-reviews/${booking.car?._id}`);

        } catch (error) {
            console.error("Error submitting review:", error.response?.data);
            alert(error.response?.data?.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }

    };

    

    const getStatusBadge = (status) => {
        const badgeStyles = {
            Pending: { backgroundColor: "#ffc107", color: "#000" },
            Confirmed: { backgroundColor: "#28a745", color: "#fff" },
            Delivered: { backgroundColor: "#007bff", color: "#fff" },
            Cancelled: { backgroundColor: "#dc3545", color: "#fff" },
            Default: { backgroundColor: "#6c757d", color: "#fff" }
        };
        return badgeStyles[status] || badgeStyles["Default"];
    };

    if (loading) return <p style={{ textAlign: "center", fontSize: "18px" }}>Loading your bookings...</p>;
    if (errorMessage) return <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>{errorMessage}</p>;

    return (
        <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontWeight: "bold" }}>
                    Your Bookings
                </h2>
                {bookings.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No bookings found.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ backgroundColor: "#343a40", color: "white" }}>
                                <tr>
                                    <th>Car</th>
                                    <th>Booking Date</th>
                                    <th>Duration</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Review</th>
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
                                            <span style={{
                                                ...getStatusBadge(booking.status),
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                display: "inline-block"
                                            }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            {booking.status === "Delivered" && !booking.review && (
                                                <div>
                                                    <select 
                                                        onChange={(e) => handleReviewChange(booking._id, "rating", e.target.value)}
                                                    >
                                                        <option value="">Rate</option>
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                    <textarea
                                                        placeholder="Leave a comment"
                                                        onChange={(e) => handleReviewChange(booking._id, "comment", e.target.value)}
                                                    ></textarea>
                                                    <button onClick={() => submitReview(booking)}>Submit</button>
                                                </div>
                                            )}
                                            {booking.review && <p>Review Submitted</p>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatus;
