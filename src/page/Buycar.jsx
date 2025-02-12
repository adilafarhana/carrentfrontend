import React from "react";
import { Link } from "react-router-dom";

const cars = [
  { id: 1, name: "Toyota Corolla", price: "$10,000", img: "https://apollo.olx.in/v1/files/hk4ln6h8o66s2-IN/image;s=780x0;q=60" },
  { id: 2, name: "Honda Civic", price: "$12,000", img: "https://apollo.olx.in/v1/files/787u2kdn2hc61-IN/image;s=780x0;q=60" },
  { id: 3, name: "maruti suzuki swift", price: "4,50,000", img: "https://apollo.olx.in/v1/files/9vmhde62l3g22-IN/image;s=780x0;q=60" },
  { id: 4, name: "Honda Civic", price: "$12,000", img: "https://apollo.olx.in/v1/files/787u2kdn2hc61-IN/image;s=780x0;q=60" },
];

const Buycars = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Available Used Cars</h2>
      <div className="row">
        {cars.map((car) => (
          <div className="col-md-4" key={car.id}>
            <div className="card">
              <img src={car.img} className="card-img-top" alt={car.name} />
              <div className="card-body">
                <h5 className="card-title">{car.name}</h5>
                <p className="card-text">{car.price}</p>
                <Link to={`/car-details/${car.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buycars;
