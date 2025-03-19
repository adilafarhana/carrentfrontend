import React, { useState } from "react";
import Navadmindashboard from "./Nav/Navadmindashboard";

const Predict = () => {
  const [date, setDate] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!date || !carBrand || !carModel) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setError(""); // Clear previous errors
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, car_brand: carBrand, car_model: carModel }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.predicted_bookings);
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to fetch prediction. Check API connection.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        backgroundColor: "#f7fafc", // Light gray background
      }}
    >
      <Navadmindashboard />
      <div
        style={{
          backgroundColor: "#ffffff", // White background
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          width: "90%", // Use 90% of the screen width
          maxWidth: "500px", // Limit maximum width
          margin: "0 auto", // Center the form
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#2d3748", // Dark gray text
          }}
        >
          Vehicle Booking Prediction
        </h1>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#4a5568" }}>
            Select Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #cbd5e0", // Light gray border
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#4a5568" }}>
            Car Brand:
          </label>
          <input
            type="text"
            value={carBrand}
            onChange={(e) => setCarBrand(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #cbd5e0", // Light gray border
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#4a5568" }}>
            Car Model:
          </label>
          <input
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #cbd5e0", // Light gray border
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={handlePredict}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#4299e1", // Blue background
            color: "#ffffff", // White text
            fontWeight: "bold",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#3182ce")} // Darker blue on hover
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4299e1")}
        >
          Get Prediction
        </button>

        {error && (
          <p style={{ color: "#e53e3e", marginTop: "1rem", textAlign: "center" }}>{error}</p>
        )}

        {prediction !== null && (
          <p style={{ color: "#38a169", marginTop: "1rem", textAlign: "center" }}>
            📈 Predicted Bookings: {prediction}
          </p>
        )}
      </div>
    </div>
  );
};

export default Predict; 