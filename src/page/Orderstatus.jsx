import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navrent from "./Nav/Navrent";
import { ClipLoader } from "react-spinners";

const OrderStatus = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reviewData, setReviewData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
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
                    `https://carrentbackend-1-tpmm.onrender.com/userBookings/${storedUserId}`, 
                    {}, 
                    requestHeader
                );

                setBookings(response.data || []);
            } catch (error) {
                setErrorMessage("Failed to fetch bookings.");
                console.error("Fetch error:", error);
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
                "https://carrentbackend-1-tpmm.onrender.com/addReview",
                reviewPayload,
                requestHeader
            );

            alert("Review submitted successfully!");
            navigate(`/car-reviews/${booking.car?._id}`);

        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit review.");
            console.error("Review error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const badgeStyles = {
            Pending: { backgroundColor: "#ffc107", color: "#000" },
            Confirmed: { backgroundColor: "#28a745", color: "#fff" },
            Delivered: { backgroundColor: "#007bff", color: "#fff" },
            Returned: { backgroundColor: "#6f42c1", color: "#fff" },
            Cancelled: { backgroundColor: "#dc3545", color: "#fff" },
            Default: { backgroundColor: "#6c757d", color: "#fff" }
        };
        return badgeStyles[status] || badgeStyles["Default"];
    };

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
    };

    const getStatusInstructions = (status) => {
        switch (status) {
            case "Pending":
                return "Your booking is being processed. Please wait for confirmation.";
            case "Confirmed":
                return "Your booking is confirmed. Prepare for your rental/purchase.";
            case "Delivered":
                return "Your car has been delivered. Enjoy your ride!";
            case "Returned":
                return "Your car has been returned. View details for return information.";
            case "Cancelled":
                return "Booking cancelled. Contact support for assistance.";
            default:
                return "";
        }
    };

    const renderFlipCard = (booking) => {
        const isDelivered = booking.status === "Delivered";
        const isReturned = booking.status === "Returned";
        const hasReview = booking.review;

        return (
            <div key={booking._id} style={{
                perspective: "1000px",
                width: "100%",
                maxWidth: "500px",
                height: "240px",
                margin: "20px",
            }}>
                <div style={{
                    width: "100%",
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
                        <div>
                            <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "bold" }}>
                                {booking?.car?.brand} {booking?.car?.model}
                            </h4>
                            <p style={{ margin: "5px 0", fontSize: "14px" }}>
                                <strong>Date:</strong> {new Date(booking?.date).toLocaleDateString()}
                            </p>
                            {booking?.duration && (
                                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                                    <strong>Duration:</strong> {booking.duration} hours
                                </p>
                            )}
                            <p style={{ margin: "5px 0", fontSize: "14px" }}>
                                <strong>Total:</strong> ₹{booking?.totalPrice?.toFixed(2)}
                            </p>
                            <div style={{ margin: "10px 0" }}>
                                <strong>Status:</strong>{" "}
                                <span
                                    style={{
                                        ...getStatusBadge(booking.status),
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        display: "inline-block",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => handleStatusClick(booking.status)}
                                >
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                        
                        <div style={{ display: "flex", gap: "10px" }}>
                            {isReturned && (
                                <button
                                    style={{
                                        backgroundColor: "#17a2b8",
                                        color: "#fff",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        flex: 1,
                                        minWidth: "120px"
                                    }}
                                    onClick={() => navigate(`/returns/${booking._id}`)}
                                >
                                    Return Details
                                </button>
                            )}
                            
                            {isDelivered && !hasReview && (
                                <button
                                    style={{
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        flex: 1,
                                        minWidth: "120px"
                                    }}
                                    onClick={() => handleReviewChange(booking._id, "flip", true)}
                                    disabled={submitting}
                                >
                                    {submitting ? "Processing..." : "Leave Review"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Back Side - Review Form */}
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
                            gap: "12px"
                        }}>
                            <h5 style={{ margin: "0", textAlign: "center" }}>Review {booking.car?.brand}</h5>
                            
                            <select
                                style={{ 
                                    padding: "10px", 
                                    borderRadius: "8px", 
                                    border: "1px solid #ddd",
                                    fontSize: "14px"
                                }}
                                value={reviewData[booking._id]?.rating || ""}
                                onChange={(e) => handleReviewChange(booking._id, "rating", e.target.value)}
                                required
                            >
                                <option value="">Select Rating</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>
                                        {num} Star{num !== 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                            
                            <textarea
                                style={{ 
                                    padding: "10px", 
                                    borderRadius: "8px", 
                                    resize: "none", 
                                    fontSize: "14px",
                                    border: "1px solid #ddd",
                                    minHeight: "80px"
                                }}
                                placeholder="Share your experience..."
                                value={reviewData[booking._id]?.comment || ""}
                                onChange={(e) => handleReviewChange(booking._id, "comment", e.target.value)}
                                required
                            />
                            
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    style={{
                                        backgroundColor: "#28a745",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        flex: 1
                                    }}
                                    onClick={() => submitReview(booking)}
                                    disabled={submitting}
                                >
                                    {submitting ? <ClipLoader size={15} color="#fff" /> : "Submit"}
                                </button>
                                
                                <button
                                    style={{
                                        backgroundColor: "#dc3545",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        flex: 1
                                    }}
                                    onClick={() => handleReviewChange(booking._id, "flip", false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh",
                flexDirection: "column" 
            }}>
                <ClipLoader color="#3498db" size={50} />
                <p style={{ marginTop: "20px" }}>Loading your bookings...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Navrent />
                <div style={{ 
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "20px",
                    borderRadius: "8px",
                    maxWidth: "600px",
                    margin: "40px auto"
                }}>
                    <h3>Error Loading Bookings</h3>
                    <p>{errorMessage}</p>
                    <button
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "15px"
                        }}
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const rentalBookings = bookings.filter(booking => booking?.car?.type === "Rent");
    const usedBookings = bookings.filter(booking => booking?.car?.type === "Used");

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Navrent />
            
            <div style={{
                backgroundColor: "#f8f9fa",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                marginBottom: "30px"
            }}>
                <h2 style={{ 
                    textAlign: "center", 
                    marginBottom: "25px", 
                    color: "#343a40",
                    fontWeight: "600"
                }}>
                    Your Booking History
                </h2>
                
                {selectedStatus && (
                    <div style={{
                        backgroundColor: "#e9ecef",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "15px",
                        color: "#495057"
                    }}>
                        <strong>Status Information:</strong> {getStatusInstructions(selectedStatus)}
                    </div>
                )}
                
                {bookings.length === 0 ? (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "40px 20px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
                    }}>
                        <h4 style={{ color: "#6c757d" }}>No Bookings Found</h4>
                        <p>You haven't made any bookings yet.</p>
                        <button
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginTop: "15px"
                            }}
                            onClick={() => navigate("/cars")}
                        >
                            Browse Cars
                        </button>
                    </div>
                ) : (
                    <div style={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        justifyContent: "center",
                        gap: "20px"
                    }}>
                        {[...rentalBookings, ...usedBookings].map(renderFlipCard)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatus;