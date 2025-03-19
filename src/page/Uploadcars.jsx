import React from "react";
import { useLocation } from "react-router-dom";

const UploadCars = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const carId = queryParams.get("carId");

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Uploaded Car Details</h2>
      {carId ? <p>Showing details for Car ID: {carId}</p> : <p>All uploaded cars</p>}
    </div>
  );
};

export default UploadCars;
