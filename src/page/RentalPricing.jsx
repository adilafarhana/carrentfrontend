import React, { useState } from "react";
import axios from "axios";

const RentalPricing = () => {
  const [formData, setFormData] = useState({
    base_price: "",
    availability: "",
    demand: "",
    peak_hour: 0,
    rental_duration: "",
    day_of_week: "",
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict_price", formData);
      setPredictedPrice(response.data.predicted_rental_price);
    } catch (err) {
      setError("Error fetching rental price.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Car Rental Pricing Predictor</h2>

      <form className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Base Price</label>
          <input type="number" name="base_price" value={formData.base_price} onChange={handleChange} required className="w-full p-2 border rounded"/>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Availability</label>
          <input type="number" name="availability" value={formData.availability} onChange={handleChange} required className="w-full p-2 border rounded"/>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Demand (%)</label>
          <input type="number" name="demand" value={formData.demand} onChange={handleChange} required className="w-full p-2 border rounded"/>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Peak Hour (1 = Yes, 0 = No)</label>
          <input type="number" name="peak_hour" value={formData.peak_hour} onChange={handleChange} required className="w-full p-2 border rounded"/>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Rental Duration (Days)</label>
          <input type="number" name="rental_duration" value={formData.rental_duration} onChange={handleChange} required className="w-full p-2 border rounded"/>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Day of the Week (1=Mon, 7=Sun)</label>
          <input type="number" name="day_of_week" value={formData.day_of_week} onChange={handleChange} required className="w-full p-2 border rounded"/>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {loading ? "Predicting..." : "Get Predicted Price"}
        </button>
      </form>

      {predictedPrice && (
        <div className="mt-4 bg-green-200 text-green-700 p-4 rounded">
          <h3 className="text-lg font-bold">Predicted Rental Price: ₹{predictedPrice.toFixed(2)}</h3>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default RentalPricing;
