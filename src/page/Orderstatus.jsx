import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navrent from "./Nav/Navrent";

const OrderStatus = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reviewData, setReviewData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null); // Track selected status
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
                    `https://carrentbackend-1-tpmm.onrender.com//userBookings/${storedUserId}`, {}, requestHeader
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

        try {
            await axios.post(
                "https://carrentbackend-1-tpmm.onrender.com//addReview",
                reviewPayload,
                requestHeader
            );

            alert("Review submitted successfully!");
            navigate(`/car-reviews/${booking.car?._id}`);

        } catch (error) {
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

    const handleStatusClick = (status) => {
        setSelectedStatus(status); // Set the selected status
    };

    const getStatusInstructions = (status) => {
        switch (status) {
            case "Pending":
                return "Your booking is currently being processed. Please wait for confirmation.";
            case "Confirmed":
                return "Your booking has been confirmed. Prepare for your rental or purchase.";
            case "Delivered":
                return "Your car has been delivered. Enjoy your ride!";
            case "Cancelled":
                return "Your booking has been cancelled. Contact support for further assistance.";
            default:
                return "";
        }
    };

    if (loading) return <p style={{ textAlign: "center", fontSize: "18px" }}>Loading your bookings...</p>;
    if (errorMessage) return <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>{errorMessage}</p>;

    const rentalBookings = bookings.filter(booking => booking?.car?.type === "Rent");
    const usedBookings = bookings.filter(booking => booking?.car?.type === "Used");

    const renderFlipCard = (booking) => {
        const isDelivered = booking.status === "Delivered";
        const hasReview = booking.review;

        return (
            <>
          <div>
          
            <div key={booking._id} style={{
                perspective: "1000px",
                width: "500px",
                height: "200px",
                margin: "20px",
                aligh:"center"
                
            }}>

                <div style={{
                    width: "100000",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    transform: reviewData[booking._id]?.flip ? "rotateY(180deg)" : "rotateY(0)"
                }}>
                    {/* Front Side */}
                    <div style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}>
                        <h4 style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>{booking?.car?.brand} {booking?.car?.model}</h4>
                        <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Date:</strong> {booking?.date}</p>
                        <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Duration:</strong> {booking?.duration} hours</p>
                        <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Total Price:</strong> ₹{booking?.totalPrice}</p>
                        <p style={{ margin: "5px 0", fontSize: "14px" }}>
                            <strong>Status:</strong>{" "}
                            <span
                                style={{
                                    ...getStatusBadge(booking.status),
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    display: "inline-block",
                                    fontSize: "12px"
                                }}
                                onClick={() => handleStatusClick(booking.status)} // Add click handler
                            >
                                {booking.status}
                            </span>
                        </p>
                        {isDelivered && !hasReview && (
                            <button
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                                onClick={() => handleReviewChange(booking._id, "flip", true)}
                            >
                                Leave a Review
                            </button>
                        )}
                    </div>

                    {/* Back Side */}
                    {isDelivered && !hasReview && (
                        <div style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                            padding: "20px",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}>
                            <select
                                style={{ padding: "10px", borderRadius: "8px", fontSize: "14px" }}
                                onChange={(e) => handleReviewChange(booking._id, "rating", e.target.value)}
                            >
                                <option value="">Rate</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <textarea
                                style={{ padding: "10px", borderRadius: "8px", resize: "none", fontSize: "14px" }}
                                placeholder="Leave a comment"
                                onChange={(e) => handleReviewChange(booking._id, "comment", e.target.value)}
                            ></textarea>
                            <button
                                style={{
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                                onClick={() => submitReview(booking)}
                            >
                                Submit Review
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                                onClick={() => handleReviewChange(booking._id, "flip", false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
            </div>

            </>
        );
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
            <Navrent/>
            <div style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                width:"100000   "
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontWeight: "bold" }}>
                    Your Bookings
                </h2>
                {selectedStatus && (
                    <div style={{
                        backgroundColor: "#e9ecef",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        color: "#495057",
                        width:"100000px"
                    }}>
                        <strong>Instructions:</strong> {getStatusInstructions(selectedStatus)}
                    </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                    {rentalBookings.map(renderFlipCard)}
                    {usedBookings.map(renderFlipCard)}
                </div>
            </div>
        </div>
    );
};

export default OrderStatus;