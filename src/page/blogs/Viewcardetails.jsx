import React, { useState, useEffect } from "react";

// CarCard Component: Display Car Details in a Card View
const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <div className="car-image">
        {car.images && car.images.length > 0 ? (
          <img src={URL.createObjectURL(car.images[0])} alt="Car" />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      <div className="car-details">
        <h3>{car.brand} {car.model}</h3>
        <p><strong>Price:</strong> ₹{car.price}</p>
        <p><strong>Type:</strong> {car.type}</p>
        <p><strong>Description:</strong> {car.description}</p>
      </div>
    </div>
  );
};

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
  const [uploadedCar, setUploadedCar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadedCar(formData); // Save the form data as uploaded car details
    alert("Car details submitted successfully!");
    setFormData({ brand: "", model: "", price: "", description: "", type: "", images: [] }); // Reset the form
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h2>Upload Car Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price (in ₹)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Car Images</label>
            <input
              type="file"
              name="images"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="mb-3 image-preview-container">
              <h5>Image Previews:</h5>
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="image-preview"
                />
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Upload Car
          </button>
        </form>
      </div>

      {/* Show Car Details if Uploaded */}
      {uploadedCar && <CarCard car={uploadedCar} />}
    </div>
  );
};

export default Admincarupload;
