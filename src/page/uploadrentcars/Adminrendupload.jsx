import axios from "axios";
import React, { useState, useEffect } from "react";

const AdminCarUpload = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    rentalPricePerHour: "", // Only used if type is "Rent"
    description: "",
    type: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [cars, setCars] = useState([]);

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get("https://carrentbackend-1-tpmm.onrender.com/getcars", requestHeader);
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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((image) => formDataToSend.append("images", image));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("https://carrentbackend-1-tpmm.onrender.com/uploadcar", formDataToSend, requestHeader);
      alert(response?.data?.message || "Car uploaded successfully!");
      fetchCars();
    } catch (error) {
      console.error("Error saving car details:", error);
      alert(`Error uploading car details: ${error.message}`);
    }
  };

  const handleDelete = async (carId) => {
    try {
      await axios.delete(`https://carrentbackend-1-tpmm.onrender.com/deletecar/${carId}`, requestHeader);
      alert("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error.message);
      alert(`Error deleting car: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Upload Car Details</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="brand" placeholder="Brand" onChange={handleChange} value={formData.brand} required />
        <input type="text" name="model" placeholder="Model" onChange={handleChange} value={formData.model} required />
        <input type="number" name="price" placeholder="Price (for sale)" onChange={handleChange} value={formData.price} required />
        
        <select name="type" onChange={handleChange} value={formData.type} required>
          <option value="">Select Type</option>
          <option value="Used">Used Car</option>
          <option value="Rent">Rental Car</option>
        </select>

        {formData.type === "Rent" && (
          <input type="number" name="rentalPricePerHour" placeholder="Rental Price per Hour" onChange={handleChange} value={formData.rentalPricePerHour} required />
        )}

        <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} required />

        <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} required />

        {imagePreviews.length > 0 && (
          <div className="image-previews">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} width="100" />
            ))}
          </div>
        )}

        <button type="submit">Upload Car</button>
      </form>

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
