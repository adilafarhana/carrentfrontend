import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewReview = () => {
    const { carId } = useParams(); // Get carId from URL
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const requestHeader = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.post(
                    "https://carrentbackend-1-tpmm.onrender.com/viewReviews",
                    { carId }, // Send carId in request body
                    requestHeader
                );
                console.log("Fetched reviews:", response.data);
                setReviews(response.data);
            } catch (err) {
                setError("Failed to fetch reviews.");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [carId]);

    if (loading) return <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>Loading reviews...</p>;
    if (error) return <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>{error}</p>;

    return (
        <div style={{
            padding: "30px",
            maxWidth: "800px",
            margin: "0 auto",
            background: "#f9f9f9",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "26px", color: "#333", fontWeight: "bold" }}>
                Car Reviews
            </h2>

            {reviews.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>No reviews available for this car.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {reviews.map((review) => (
                        <li key={review._id} style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "15px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.2s ease-in-out",
                            cursor: "pointer"
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#007bff" }}>
                                <strong>User:</strong> {review.userId.name}
                            </p>
                            <p style={{ fontSize: "16px", color: "#ffcc00" }}>
                                <strong>Rating:</strong> {Array(review.rating).fill("⭐").join("")}
                            </p>
                            <p style={{ fontSize: "16px", color: "#555" }}>
                                <strong>Comment:</strong> {review.comment}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewReview;
