import React, { useEffect, useState } from "react";

const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3030/cars")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching car details:", error));
  }, []);

  return (
    <div className="container">
      <h2>Available Cars</h2>
      <div className="row">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car._id} className="col-md-4">
              <div className="card">
                {car.images.length > 0 && (
                  <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} />
                )}
                <div className="card-body">
                  <h5>{car.brand} {car.model}</h5>
                  <p>{car.description}</p>
                  <p><strong>Price:</strong> ₹{car.price}</p>
                  <p><strong>Type:</strong> {car.type}</p>
                  <button>View Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No cars available.</p>
        )}
      </div>
    </div>
  );
};

export default Cars;
