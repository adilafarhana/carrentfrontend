import React from "react";
import { useLocation } from "react-router-dom";



const Admincardetails = () => {
  const location = useLocation();
  const { brand, model, price, description, type, images } = location.state; // Get car data from state

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <div className="card" style={{ width: "18rem" }}>
        {/* Display the first image */}
        <img
          src={URL.createObjectURL(images[0])}
          className="card-img-top"
          alt={brand}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          {/* Display car details */}
          <h5 className="card-title">{brand} {model}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{type}</h6>
          <p className="card-text">{description}</p>
          <p className="card-text"><strong>Price:</strong> ₹{price}</p>

          {/* Button Links */}
          <a href="#" className="btn btn-secondary">Contact Admin</a>
        </div>
      </div>
    </div>
  );
};

export default Admincardetails;
