import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admincarupload = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    description: "",
    type: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [carId, setCarId] = useState(null);
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:3030/getcars");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({ ...prevData, images: files }));
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.price || !formData.description || !formData.type || formData.images.length === 0) {
      alert("Please fill in all fields and upload images.");
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
      const response = await fetch("http://localhost:3030/uploadcar", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload car");
      }

      const data = await response.json();
      setCarId(data._id);
      alert("Car uploaded successfully!");

      const updatedCars = await fetch("http://localhost:3030/getcars").then((res) => res.json());
      setCars(updatedCars);

    } catch (error) {
      console.error("Error saving car details:", error);
      alert(`Error uploading car details: ${error.message}`);
    }
  };

  const handleDelete = async (carId) => {
    try {
      const response = await fetch(`http://localhost:3030/deletecar/${carId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete car");
      }

      alert("Car deleted successfully!");
      const updatedCars = await fetch("http://localhost:3030/getcars").then((res) => res.json());
      setCars(updatedCars);

    } catch (error) {
      console.error("Error deleting car:", error);
      alert(`Error deleting car: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Upload Car Details</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          onChange={handleChange}
          value={formData.brand}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          onChange={handleChange}
          value={formData.model}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          value={formData.price}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          required
        />
        <select
          name="type"
          onChange={handleChange}
          value={formData.type}
          required
        >
          <option value="">Select Type</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Convertible">Convertible</option>
        </select>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          required
        />
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
                <td>
                  <button onClick={() => handleDelete(car._id)} className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No cars uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h2, h3 {
          text-align: center;
          color: #333;
        }

        .form-container input, 
        .form-container textarea, 
        .form-container select {
          width: 100%;
          margin-bottom: 15px;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }

        .form-container button {
          background-color: #007bff;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
          font-size: 16px;
        }

        .form-container button:hover {
          background-color: #0056b3;
        }

        .image-previews {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .image-previews img {
          border-radius: 8px;
        }

        .car-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .car-table th, .car-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .car-table th {
          background-color: #f4f4f4;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          cursor: pointer;
        }

        .btn-danger {
          background-color: red;
          color: white;
        }

        .btn-danger:hover {
          background-color: darkred;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px;
          }

          .form-container input, 
          .form-container textarea, 
          .form-container select {
            padding: 10px;
            font-size: 14px;
          }

          .form-container button {
            padding: 10px 18px;
          }

          .image-previews {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Admincarupload;
