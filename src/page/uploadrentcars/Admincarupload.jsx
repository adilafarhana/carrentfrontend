import axios from "axios";
import React, { useState, useEffect } from "react";

const AdminCarUpload = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    rentalPricePerHour: "",
    description: "",
    type: "",
    specialOffers: "",
    discountPercentage: "",
    images: [],

  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [cars, setCars] = useState([]);

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:3030/getcars", requestHeader);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({ ...prevData, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };
  
  const handleDelete = async (carId) => {
    try {
      await axios.delete(`http://localhost:3030/deletecar/${carId}`, requestHeader);
      alert("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error.message);
      alert(`Error deleting car: ${error.message}`);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.brand || !formData.model || !formData.price || !formData.description || !formData.type || formData.images.length === 0) {
      alert("Please fill in all fields and upload images.");
      return;
    }
  
    if (formData.type === "Rent" && !formData.rentalPricePerHour) {
      alert("Please specify the rental price per hour.");
      return;
    }
  
    let finalPrice = parseFloat(formData.price);
  
    if (formData.type === "Used" && formData.discountPercentage) {
      const discountAmount = (finalPrice * parseFloat(formData.discountPercentage)) / 100;
      finalPrice = finalPrice - discountAmount;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("model", formData.model);
    formDataToSend.append("price", finalPrice);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("specialOffers", formData.specialOffers);
    formDataToSend.append("discountPercentage", formData.discountPercentage || 0);
  
    if (formData.type === "Rent") {
      formDataToSend.append("rentalPricePerHour", formData.rentalPricePerHour);
    }
  
    formData.images.forEach((image) => formDataToSend.append("images", image));
  
    try {
      const response = await axios.post("http://localhost:3030/uploadcar", formDataToSend, requestHeader);
      alert(response?.data?.message || "Car uploaded successfully!");
      fetchCars();
    } catch (error) {
      console.error("Error saving car details:", error);
      alert(`Error uploading car details: ${error.message}`);
    }
  };
  

  return (
    <div className="container">
      <h2>Upload Car Details</h2>

      {/* Car Upload Form */}
      <form onSubmit={handleSubmit} className="form-container">
        <table className="form-table">
          <tbody>
            <tr>
              <td><label>Brand:</label></td>
              <td><input type="text" name="brand" onChange={handleChange} value={formData.brand} required /></td>
            </tr>
            <tr>
              <td><label>Model:</label></td>
              <td><input type="text" name="model" onChange={handleChange} value={formData.model} required /></td>
            </tr>
            <tr>
              <td><label>Price (for Sale):</label></td>
              <td><input type="number" name="price" onChange={handleChange} value={formData.price} required /></td>
            </tr>
            <tr>
              <td><label>Type:</label></td>
              <td>
                <select name="type" onChange={handleChange} value={formData.type} required>
                  <option value="">Select Type</option>
                  <option value="Used">Used Car</option>
                  <option value="Rent">Rental Car</option>
                </select>
              </td>
            </tr>
            {formData.type === "Rent" && (
              <tr>
                <td><label>Rental Price per Hour:</label></td>
                <td><input type="number" name="rentalPricePerHour" onChange={handleChange} value={formData.rentalPricePerHour} required /></td>
              </tr>
            )}
            <tr>
              <td><label>Description:</label></td>
              <td><textarea name="description" onChange={handleChange} value={formData.description} required /></td>
            </tr>
            <input type="number" name="discountPercentage" placeholder="Discount %" onChange={handleChange} />
      <input type="text" name="specialOffers" placeholder="Special Offer (if any)" onChange={handleChange} />
            <tr>
              <td><label>Upload Images:</label></td>
              <td><input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} required /></td>
            </tr>
          </tbody>
        </table>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="image-previews">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} width="100" />
            ))}
          </div>
        )}

        <button type="submit">Upload Car</button>
      </form>

      {/* Uploaded Cars Table */}
      <h3>Uploaded Cars</h3>
      <table className="car-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Price</th>
            <th>Rental Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.length > 0 ? (
            cars.map((car) => (
              <tr key={car._id}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.price} USD</td>
                <td>{car.type === "Rent" ? `${car.rentalPricePerHour} USD/hour` : "N/A"}</td>
                <td>{car.type}</td>
                <td>
                  <button onClick={() => handleDelete(car._id)} className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No cars uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCarUpload;
