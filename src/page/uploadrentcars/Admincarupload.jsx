import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navadmindashboard from "../Nav/Navadmindashboard";

const AdminCarUpload = () => {
  const navigate = useNavigate();
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
    status: "Available",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Styles
  const styles = {
    container: {
      padding: "2rem",
      marginTop: "5rem",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
    },
    header: {
      textAlign: "center",
      fontSize: "2rem",
      color: "#2c3e50",
      marginBottom: "2rem",
      fontWeight: "600",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "2rem",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    formTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    formRow: {
      marginBottom: "1rem",
    },
    label: {
      padding: "1rem",
      fontWeight: "600",
      color: "#2c3e50",
      width: "25%",
    },
    input: {
      padding: "0.75rem",
      borderRadius: "0.25rem",
      border: "1px solid #ced4da",
      width: "100%",
      fontSize: "1rem",
      transition: "border-color 0.3s ease",
      "&:focus": {
        borderColor: "#80bdff",
        outline: "none",
        boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
      },
    },
    select: {
      padding: "0.75rem",
      borderRadius: "0.25rem",
      border: "1px solid #ced4da",
      width: "100%",
      fontSize: "1rem",
      cursor: "pointer",
    },
    textarea: {
      padding: "0.75rem",
      borderRadius: "0.25rem",
      border: "1px solid #ced4da",
      width: "100%",
      minHeight: "100px",
      fontSize: "1rem",
      resize: "vertical",
    },
    imagePreviews: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      marginTop: "1rem",
    },
    previewImage: {
      width: "120px",
      height: "auto",
      borderRadius: "0.25rem",
      border: "1px solid #ddd",
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "0.25rem",
      border: "none",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginRight: "1rem",
    },
    submitButton: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#0069d9",
      },
    },
    viewButton: {
      backgroundColor: "#28a745",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#218838",
      },
    },
    requiredField: {
      color: "#dc3545",
      marginLeft: "0.25rem",
    },
    notification: {
      backgroundColor: "#d4edda",
      color: "#155724",
      padding: "1rem",
      borderRadius: "0.25rem",
      marginBottom: "1rem",
      display: notification ? "block" : "none",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      padding: "1rem",
    },
  };

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

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
    setLoading(true);

    // Validation
    if (!formData.brand || !formData.model || !formData.price || !formData.description || !formData.type || formData.images.length === 0) {
      alert("Please fill in all required fields and upload images.");
      setLoading(false);
      return;
    }

    if (formData.type === "Rent" && (!formData.rentalPricePerHour || !formData.rentalPricePerday || !formData.rentalPricePerweak || !formData.rentalPricePermonth)) {
      alert("Please specify all rental prices.");
      setLoading(false);
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
      const response = await axios.post(
        "https://carrentbackend-1-tpmm.onrender.com/uploadcar",
        formDataToSend,
        requestHeader
      );
      
      setNotification(
        formData.type === "Rent" 
          ? "🚗 A new rental car has been uploaded!" 
          : "🚗 A new used car is now available for sale!"
      );

      // Reset form
      setFormData({
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
        status: "Available",
      });
      setImagePreviews([]);

      alert(response?.data?.message || "Car uploaded successfully!");
    } catch (error) {
      console.error("Error saving car details:", error);
      alert(`Error uploading car details: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navadmindashboard />
      <div style={styles.container}>
        <h1 style={styles.header}>Upload Car Details</h1>
        
        {notification && (
          <div style={styles.notification}>
            {notification}
          </div>
        )}

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <table style={styles.formTable}>
              <tbody>
                {/* Brand */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Brand<span style={styles.requiredField}>*</span></td>
                  <td>
                    <input
                      type="text"
                      name="brand"
                      onChange={handleChange}
                      value={formData.brand}
                      required
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Model */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Model<span style={styles.requiredField}>*</span></td>
                  <td>
                    <input
                      type="text"
                      name="model"
                      onChange={handleChange}
                      value={formData.model}
                      required
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Price */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Price (USD)<span style={styles.requiredField}>*</span></td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      onChange={handleChange}
                      value={formData.price}
                      required
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Mileage */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Mileage (km)</td>
                  <td>
                    <input
                      type="number"
                      name="mileage"
                      onChange={handleChange}
                      value={formData.mileage}
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Fuel Type */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Fuel Type</td>
                  <td>
                    <select
                      name="fuelType"
                      onChange={handleChange}
                      value={formData.fuelType}
                      style={styles.select}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </td>
                </tr>

                {/* Transmission */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Transmission</td>
                  <td>
                    <select
                      name="transmission"
                      onChange={handleChange}
                      value={formData.transmission}
                      style={styles.select}
                    >
                      <option value="">Select Transmission</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </td>
                </tr>

                {/* Seating Capacity */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Seating Capacity</td>
                  <td>
                    <input
                      type="number"
                      name="seatingCapacity"
                      onChange={handleChange}
                      value={formData.seatingCapacity}
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Year */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Year</td>
                  <td>
                    <input
                      type="number"
                      name="year"
                      onChange={handleChange}
                      value={formData.year}
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Color */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Color</td>
                  <td>
                    <input
                      type="text"
                      name="color"
                      onChange={handleChange}
                      value={formData.color}
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Type */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Type<span style={styles.requiredField}>*</span></td>
                  <td>
                    <select
                      name="type"
                      onChange={handleChange}
                      value={formData.type}
                      required
                      style={styles.select}
                    >
                      <option value="">Select Type</option>
                      <option value="Used">Used Car</option>
                      <option value="Rent">Rental Car</option>
                    </select>
                  </td>
                </tr>

                {/* Rental Prices (conditionally rendered) */}
                {formData.type === "Rent" && (
                  <>
                    <tr style={styles.formRow}>
                      <td style={styles.label}>Price per Hour (USD)<span style={styles.requiredField}>*</span></td>
                      <td>
                        <input
                          type="number"
                          name="rentalPricePerHour"
                          onChange={handleChange}
                          value={formData.rentalPricePerHour}
                          required
                          style={styles.input}
                        />
                      </td>
                    </tr>
                    <tr style={styles.formRow}>
                      <td style={styles.label}>Price per Day (USD)<span style={styles.requiredField}>*</span></td>
                      <td>
                        <input
                          type="number"
                          name="rentalPricePerday"
                          onChange={handleChange}
                          value={formData.rentalPricePerday}
                          required
                          style={styles.input}
                        />
                      </td>
                    </tr>
                    <tr style={styles.formRow}>
                      <td style={styles.label}>Price per Week (USD)<span style={styles.requiredField}>*</span></td>
                      <td>
                        <input
                          type="number"
                          name="rentalPricePerweak"
                          onChange={handleChange}
                          value={formData.rentalPricePerweak}
                          required
                          style={styles.input}
                        />
                      </td>
                    </tr>
                    <tr style={styles.formRow}>
                      <td style={styles.label}>Price per Month (USD)<span style={styles.requiredField}>*</span></td>
                      <td>
                        <input
                          type="number"
                          name="rentalPricePermonth"
                          onChange={handleChange}
                          value={formData.rentalPricePermonth}
                          required
                          style={styles.input}
                        />
                      </td>
                    </tr>
                  </>
                )}

                {/* Description */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Description<span style={styles.requiredField}>*</span></td>
                  <td>
                    <textarea
                      name="description"
                      onChange={handleChange}
                      value={formData.description}
                      required
                      style={styles.textarea}
                    />
                  </td>
                </tr>

                {/* Discount */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Discount (%)</td>
                  <td>
                    <input
                      type="number"
                      name="discountPercentage"
                      onChange={handleChange}
                      value={formData.discountPercentage}
                      min="0"
                      max="100"
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Special Offers */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Special Offer</td>
                  <td>
                    <input
                      type="text"
                      name="specialOffers"
                      onChange={handleChange}
                      value={formData.specialOffers}
                      style={styles.input}
                    />
                  </td>
                </tr>

                {/* Image Upload */}
                <tr style={styles.formRow}>
                  <td style={styles.label}>Images<span style={styles.requiredField}>*</span></td>
                  <td>
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      style={{ ...styles.input, padding: "0.5rem" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div style={styles.imagePreviews}>
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    style={styles.previewImage}
                  />
                ))}
              </div>
            )}

            {/* Buttons */}
            <div style={{ marginTop: "2rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.button, ...styles.submitButton }}
              >
                {loading ? "Uploading..." : "Upload Car"}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/admin/uploaded-cars")}
                style={{ ...styles.button, ...styles.viewButton }}
              >
                View Uploaded Cars
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCarUpload;