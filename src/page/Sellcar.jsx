import React, { useState } from "react";

const Sellcar = () => {
  const [car, setCar] = useState({ name: "", price: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Car Submitted: ${car.name}, Price: ${car.price}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Sell Your Car</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Car Name</label>
          <input type="text" className="form-control" onChange={(e) => setCar({ ...car, name: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input type="text" className="form-control" onChange={(e) => setCar({ ...car, price: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
};

export default Sellcar;
