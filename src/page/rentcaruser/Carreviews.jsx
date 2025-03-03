import React, { useState, useEffect } from "react";
import axios from "axios";

const CarReviews = ({ carId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  const requestHeader = { 
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
  };

  // Fetch existing reviews from the backend
  useEffect(() => {
    axios
      .get(`http://localhost:3030/reviews/${carId}`, requestHeader)
      .then(response => setReviews(response.data))
      .catch(error => console.error("Error fetching reviews:", error));
  }, [carId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit review to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      try {
        const response = await axios.post(
          "http://localhost:3030/addreview",
          {
            carId,
            username: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
          },
          requestHeader
        );

        if (response.status === 201) {
          setReviews([...reviews, { ...newReview }]);
          setNewReview({ name: "", rating: 5, comment: "" });
        }
      } catch (error) {
        console.error("Error adding review:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Car Reviews</h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          value={newReview.name}
          onChange={handleChange}
          placeholder="Your Name"
          style={styles.input}
          required
        />

        <select name="rating" value={newReview.rating} onChange={handleChange} style={styles.select}>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} Stars</option>
          ))}
        </select>

        <textarea
          name="comment"
          value={newReview.comment}
          onChange={handleChange}
          placeholder="Write your review..."
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.button}>Submit Review</button>
      </form>

      {/* Display Reviews */}
      <div style={styles.reviewList}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} style={styles.reviewCard}>
              <h4>{review.username}</h4>
              <p style={styles.stars}>{"⭐".repeat(review.rating)}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

// **CSS-in-JS Styling**
const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    height: "80px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  reviewList: {
    marginTop: "20px",
    textAlign: "left",
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  stars: {
    color: "#f39c12",
    fontSize: "18px",
  },
};

export default CarReviews;
