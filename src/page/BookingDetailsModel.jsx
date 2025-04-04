import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navadmindashboard from "./Nav/Navadmindashboard";
import { ClipLoader } from "react-spinners";
import { format, parseISO, differenceInHours } from "date-fns";

const BookingDetailsModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestHeader = {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(
          `https://carrentbackend-1-tpmm.onrender.com/booking/${id}`,
          requestHeader
        );

        if (response.data.success) {
          setBooking(response.data.data);
        } else {
          setError(response.data.message || "Failed to load booking details");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Failed to fetch booking details";
        setError(errorMessage);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    try {
      const hours = differenceInHours(new Date(endDate), new Date(startDate));
      return `${hours} hours`;
    } catch (e) {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ClipLoader color="#0d6efd" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Navadmindashboard />
        <div className="alert alert-danger text-center">
          <h4>Error Loading Booking</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5">
        <Navadmindashboard />
        <div className="alert alert-warning text-center">
          <h4>Booking Not Found</h4>
          <p>The requested booking could not be found.</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Navadmindashboard />
      
      <div className="row mt-4">
        <div className="col-md-12">
          <h2 className="text-center mb-4">Booking Details</h2>
          
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4>
                {booking.car?.brand} {booking.car?.model} - {booking.status}
              </h4>
            </div>
            
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Customer Information</h5>
                  <p><strong>Name:</strong> {booking.fullName}</p>
                  <p><strong>Email:</strong> {booking.email}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  <p><strong>Address:</strong> {booking.address}</p>
                </div>
                
                <div className="col-md-6">
                  <h5>Booking Information</h5>
                  <p><strong>Booking Date:</strong> {format(parseISO(booking.date), "MMM dd, yyyy hh:mm a")}</p>
                  {booking.returnTime && (
                    <p><strong>Return Date:</strong> {format(parseISO(booking.returnTime), "MMM dd, yyyy hh:mm a")}</p>
                  )}
                  <p><strong>Duration:</strong> {booking.duration ? `${booking.duration} hours` : "N/A"}</p>
                  {booking.returnTime && (
                    <p><strong>Actual Duration:</strong> {calculateDuration(booking.date, booking.returnTime)}</p>
                  )}
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                  {booking.advancePayment > 0 && (
                    <p><strong>Advance Paid:</strong> ₹{booking.advancePayment}</p>
                  )}
                  {booking.lateFee > 0 && (
                    <p><strong>Late Fee:</strong> ₹{booking.lateFee}</p>
                  )}
                </div>
              </div>

              {booking.images?.length > 0 && (
                <div className="mt-4">
                  <h5>Uploaded Documents</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {booking.images.map((image, index) => (
                      <img
                        key={index}
                        src={`https://carrentbackend-1-tpmm.onrender.com${image}`}
                        alt={`Document ${index + 1}`}
                        className="img-thumbnail"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {booking.returnCondition && (
                <div className="mt-4">
                  <h5>Return Information</h5>
                  <p><strong>Condition:</strong> {booking.returnCondition}</p>
                  {booking.returnNotes && (
                    <p><strong>Notes:</strong> {booking.returnNotes}</p>
                  )}
                </div>
              )}

              <div className="mt-4 d-flex justify-content-between">
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back to Booking History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModel;