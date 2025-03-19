import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BookingConfirmation = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://carrentbackend-1-tpmm.onrender.com/Bookingdetails",
          { id },
          requestHeader
        );
        setBookingData(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-primary fs-4">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger fs-5">{error}</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-warning fs-5">No booking details available.</p>
      </div>
    );
  }

  const { car ,bookingDetails} = bookingData;

  return (
    <div className="container mt-5">
      <h2 className="text-center">Booking Confirmation</h2>
      
      <div className="card mx-auto text-center shadow p-3" style={{ maxWidth: "500px" }}>
        {car?.images?.length > 0 && (
          <img src={`https://carrentbackend-1-tpmm.onrender.com/${car.images[0]}`} alt={car.model} className="card-img-top" />
        )}
        <div className="card-body">
          <p><strong>Brand:</strong> {car?.brand}</p>
          <p><strong>Model:</strong> {car?.model}</p>
          <p><strong>Mileage:</strong> {car.mileage} km</p>
       
          {car?.type === "Used" && <p><strong>Price:</strong> ₹{car?.price}</p>}


          <hr />

          <h5>Booking Details</h5>
          <p><strong>Full Name:</strong> {bookingData?.fullName}</p>
          <p><strong>Email:</strong> {bookingData?.email}</p>
          <p><strong>Phone:</strong> {bookingData?.phone}</p>
          <p><strong>Address:</strong> {bookingData?.address}</p>
          <p><strong>Date:</strong> {bookingData?.date}</p>
          <p><strong>Time:</strong> {bookingData?.time}</p>
          {car?.type === "Rent" && (
            <>
              <p><strong>Duration:</strong> {bookingData?.duration} hours</p>
              <h5 className="text-primary"><strong>totalPrice :</strong> ₹{bookingData?.totalPrice}</h5>
            </>
          )}
          <p><strong>Status:</strong> {bookingData?.status}</p>


          <button onClick={() => navigate("/usedcardashboard")} className="btn btn-success  w-100 mt-3">
            check the booking status
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
