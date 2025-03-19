import axios from "axios";
import React, { useState, useEffect } from "react";
import Navadmindashboard from "../Nav/Navadmindashboard";

const AdminCarUpload = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    rentalPricePerHour: "",
    rentalPricePerday: "",
    rentalPricePerweak: "",
    rentalPricePermonth: "",
    description: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    seatingCapacity: "",
    year: "",
    color: "",
    type: "",
    specialOffers: "",
    discountPercentage: "",
    images: [],
    status: "Available", // Default status
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

  const [notification, setNotification] = useState("");

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
    if (formData.type === "Rent" && !formData.rentalPricePerday) {
      alert("Please specify the rental price per day.");
      return;
    }
    if (formData.type === "Rent" && !formData.rentalPricePerweak) {
      alert("Please specify the rental price per week.");
      return;
    }
    if (formData.type === "Rent" && !formData.rentalPricePermonth) {
      alert("Please specify the rental price per month.");
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
      const response = await axios.post("http://localhost:3030/uploadcar", formDataToSend, requestHeader);
      alert(response?.data?.message || "Car uploaded successfully!");

      if (formData.type === "Rent") {
        setNotification("🚗 A new rental car has been uploaded!");
      } else if (formData.type === "Used") {
        setNotification("🚗 A new used car is now available for sale!");
      }

      fetchCars();
    } catch (error) {
      console.error("Error saving car details:", error);
      alert(`Error uploading car details: ${error.message}`);
    }
  };

  const handleDelete = async (carId) => {
    console.log("Deleting car with ID:", carId); // Debugging

    try {
      const response = await axios.delete(
        `http://localhost:3030/deletecar/${carId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message); // Show success message
      fetchCars(); // Refresh the car list
    } catch (error) {
      console.error("Error deleting car:", error.response?.data?.message || error.message);
      alert(`Error deleting car: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateStatus = async (carId, newStatus) => {
    try {
      await axios.put(`http://localhost:3030/updatestatus/${carId}`, { status: newStatus }, requestHeader);
      alert(`Car status updated to ${newStatus}`);
      fetchCars();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status.");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Navadmindashboard/><br></br>
      <h2 style={{ textAlign: "center", fontSize: "28px", color: "#333", marginBottom: "20px" }}>Upload Car Details</h2>
      <h2 style={{ textAlign: "center", fontSize: "28px", color: "#333", marginBottom: "20px" }}>Upload Car Details</h2>

      {/* Car Upload Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          // backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "10px", }}>Brand:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="text"
                  name="brand"
                  
                  onChange={handleChange}
                  value={formData.brand}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", }}>Model:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="text"
                  name="model"
                  onChange={handleChange}
                  value={formData.model}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Price (for Sale):</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={formData.price}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Mileage (km):</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="number"
                  name="mileage"
                  onChange={handleChange}
                  value={formData.mileage}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Fuel Type:</td>
              <td style={{ padding: "10px" }}>
                <select
                  name="fuelType"
                  onChange={handleChange}
                  value={formData.fuelType}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Transmission:</td>
              <td style={{ padding: "10px" }}>
                <select
                  name="transmission"
                  onChange={handleChange}
                  value={formData.transmission}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Seating Capacity:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="number"
                  name="seatingCapacity"
                  onChange={handleChange}
                  value={formData.seatingCapacity}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Year:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="number"
                  name="year"
                  onChange={handleChange}
                  value={formData.year}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Color:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="text"
                  name="color"
                  onChange={handleChange}
                  value={formData.color}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Type:</td>
              <td style={{ padding: "10px" }}>
                <select
                  name="type"
                  onChange={handleChange}
                  value={formData.type}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select Type</option>
                  <option value="Used">Used Car</option>
                  <option value="Rent">Rental Car</option>
                </select>
              </td>
            </tr>
            {formData.type === "Rent" && (
              <>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>Rental Price per Hour:</td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      name="rentalPricePerHour"
                      onChange={handleChange}
                      value={formData.rentalPricePerHour}
                      required
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>Rental Price per Day:</td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      name="rentalPricePerday"
                      onChange={handleChange}
                      value={formData.rentalPricePerday}
                      required
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>Rental Price per Week:</td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      name="rentalPricePerweak"
                      onChange={handleChange}
                      value={formData.rentalPricePerweak}
                      required
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>Rental Price per Month:</td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      name="rentalPricePermonth"
                      onChange={handleChange}
                      value={formData.rentalPricePermonth}
                      required
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Description:</td>
              <td style={{ padding: "10px" }}>
                <textarea
                  name="description"
                  onChange={handleChange}
                  value={formData.description}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Discount Percentage:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="number"
                  name="discountPercentage"
                  placeholder="Discount %"
                  onChange={handleChange}
                  value={formData.discountPercentage}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Special Offer:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="text"
                  name="specialOffers"
                  placeholder="Special Offer (if any)"
                  onChange={handleChange}
                  value={formData.specialOffers}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", fontWeight: "bold" }}>Upload Images:</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                style={{ width: "100px", height: "auto", borderRadius: "4px" }}
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload Car
        </button>
      </form>

      {/* Uploaded Cars Table */}
      <h3 style={{ textAlign: "center", fontSize: "24px", color: "#333", marginBottom: "20px" }}>Uploaded Cars</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr style={{ color: "#fff" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>Brand</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Model</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Rental Price</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.length > 0 ? (
            cars.map((car) => (
              <tr key={car._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>{car.brand}</td>
                <td style={{ padding: "12px" }}>{car.model}</td>
                <td style={{ padding: "12px" }}>{car.price} USD</td>
                <td style={{ padding: "12px" }}>
                  {car.type === "Rent"
                    ? `${car.rentalPricePerHour} USD/hour` : "N/A"}</td>
                <td>{car.type === "Rent" ? `${car.rentalPricePerday} USD/hour` : "N/A"}</td>
                <td>{car.type === "Rent" ? `${car.rentalPricePerweak} USD/hour` : "N/A"}</td>
                <td>{car.type === "Rent" ? `${car.rentalPricePermonth} USD/hour` : "N/A"}</td>
                <td>{car.type}</td>
                <td>{car.status}</td>
                <td>
                  <button onClick={() => handleDelete(car._id)} className="btn btn-danger">
                    Delete
                  </button>

                  <button
                    onClick={() => updateStatus(car._id, car.status === "Available" ? "Not Available" : "Available")}
                    className={car.status === "Available" ? "btn btn-warning" : "btn btn-success"}
                  >
                    {car.status === "Available" ? "Mark as Not Available" : "Mark as Available"}
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No cars uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCarUpload;
