import React from "react";
import { useParams } from "react-router-dom";

const carDetails = {
  1: { name: "Toyota Corolla", price: "$10,000", desc: "A reliable sedan with great mileage." },
  2: { name: "Honda Civic", price: "$12,000", desc: "A stylish car with powerful performance." },
};

const Cardetails = () => {
  const { id } = useParams();
  const car = carDetails[id];

  return (
    <div className="container mt-5 text-center">
      <h2>{car.name}</h2>
      <p>{car.desc}</p>
      <h4>Price: {car.price}</h4>
      <button className="btn btn-success">Buy Now</button>
    </div>
  );
};

export default Cardetails;
