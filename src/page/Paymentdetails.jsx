import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Paymentdetails = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3030/bookingDetails/${bookingId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setBooking(response.data);
            } catch (error) {
                setError("Failed to load payment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    if (loading) return <p>Loading payment details...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Payment Details</h2>
            <div style={{
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                backgroundColor: "#fff"
            }}>
                <p><strong>Car:</strong> {booking?.car?.brand} {booking?.car?.model}</p>
                <p><strong>Booking Date:</strong> {booking?.date}</p>
                <p><strong>Duration:</strong> {booking?.duration} hours</p>
                <p><strong>Total Price:</strong> ₹{booking?.totalPrice}</p>
                <button 
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginTop: "15px"
                    }}
                    onClick={() => alert("Redirecting to payment gateway...")}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default Paymentdetails;
