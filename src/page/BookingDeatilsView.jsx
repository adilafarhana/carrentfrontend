import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navadmindashboard from "./Nav/Navadmindashboard";
import { ClipLoader } from "react-spinners";

const BookingDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://carrentbackend-1-tpmm.onrender.com/bookings/${id}`,
          requestHeader
        );
        
        if (response.data.success) {
          setBooking(response.data.booking);
        } else {
          setError(response.data.message || 'Failed to load booking details');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch booking');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const diffMs = new Date(endDate) - new Date(startDate);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours % 24} hour${diffHours % 24 > 1 ? 's' : ''}`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: "bg-secondary",
      Confirmed: "bg-primary",
      Processing: "bg-info",
      "Ready for Delivery": "bg-warning",
      Delivered: "bg-success",
      Returned: "bg-dark",
      Cancelled: "bg-danger"
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'} text-white`}>
        {status}
      </span>
    );
  };

  const handleReturn = () => {
    navigate("/ReturnCar", { state: { bookingData: booking } });
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
        <div className="alert alert-danger">
          <h4>Error Loading Booking</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate("/admin/bookings")}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5">
        <Navadmindashboard />
        <div className="alert alert-warning">
          <h4>No Booking Found</h4>
          <p>The requested booking could not be found.</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate("/admin/bookings")}
          >
            Back to Bookings
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Booking Details</h2>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Back to History
            </button>
          </div>
          
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                {booking.car?.brand} {booking.car?.model} - {booking.status}
              </h4>
            </div>
            
            <div className="card-body">
              <div className="row">
                {/* Customer Information */}
                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h5>Customer Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-4">
                          {booking.images?.length > 0 && (
                            <img 
                              src={`https://carrentbackend-1-tpmm.onrender.com${booking.images[0]}`} 
                              alt="Customer License" 
                              className="img-thumbnail"
                              style={{ maxHeight: "150px" }}
                            />
                          )}
                        </div>
                        <div className="col-md-8">
                          <p><strong>Name:</strong> {booking.fullName}</p>
                          <p><strong>Email:</strong> {booking.email}</p>
                          <p><strong>Phone:</strong> {booking.phone}</p>
                          <p><strong>Address:</strong> {booking.address}</p>
                          <p><strong>Place:</strong> {booking.place}, {booking.pincode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Booking Summary */}
                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h5>Booking Summary</h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Status:</strong> {getStatusBadge(booking.status)}</p>
                      <p><strong>Booking Date:</strong> {formatDate(booking.date)}</p>
                      {booking.returnTime && (
                        <p><strong>Return Date:</strong> {formatDate(booking.returnTime)}</p>
                      )}
                      {booking.duration && (
                        <p><strong>Duration:</strong> {booking.duration} hours</p>
                      )}
                      {booking.returnTime && (
                        <p><strong>Actual Duration:</strong> {calculateDuration(booking.date, booking.returnTime)}</p>
                      )}
                      <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                      {booking.advancePayment > 0 && (
                        <p><strong>Advance Paid:</strong> ₹{booking.advancePayment}</p>
                      )}
                      {booking.lateFee > 0 && (
                        <p className="text-danger"><strong>Late Fee:</strong> ₹{booking.lateFee}</p>
                      )}
                      {booking.finalAmount && (
                        <p className="fw-bold"><strong>Final Amount:</strong> ₹{booking.finalAmount}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Car Information */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5>Vehicle Information</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      {booking.car?.images?.length > 0 && (
                        <img 
                          src={`https://carrentbackend-1-tpmm.onrender.com${booking.car.images[0]}`} 
                          alt={booking.car.model} 
                          className="img-fluid rounded"
                        />
                      )}
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-4">
                          <p><strong>Brand:</strong> {booking.car?.brand || 'N/A'}</p>
                          <p><strong>Model:</strong> {booking.car?.model || 'N/A'}</p>
                          <p><strong>Year:</strong> {booking.car?.year || 'N/A'}</p>
                        </div>
                        <div className="col-md-4">
                          <p><strong>Type:</strong> {booking.car?.type || 'N/A'}</p>
                          <p><strong>Color:</strong> {booking.car?.color || 'N/A'}</p>
                          <p><strong>Fuel Type:</strong> {booking.car?.fuelType || 'N/A'}</p>
                        </div>
                        <div className="col-md-4">
                          <p><strong>Transmission:</strong> {booking.car?.transmission || 'N/A'}</p>
                          <p><strong>Seating Capacity:</strong> {booking.car?.seatingCapacity || 'N/A'}</p>
                          <p><strong>Mileage:</strong> {booking.car?.mileage || 'N/A'} km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="card">
                <div className="card-header bg-light">
                  <h5>Additional Information</h5>
                </div>
                <div className="card-body">
                  {booking.status === 'Returned' && (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <p><strong>Return Condition:</strong> 
                            <span className={`badge ${getStatusBadge(booking.returnCondition)} ms-2`}>
                              {booking.returnCondition}
                            </span>
                          </p>
                        </div>
                        {booking.hoursLate > 0 && (
                          <div className="col-md-6">
                            <p><strong>Hours Late:</strong> {booking.hoursLate}</p>
                          </div>
                        )}
                      </div>
                      {booking.returnNotes && (
                        <div className="mb-3">
                          <p><strong>Return Notes:</strong></p>
                          <div className="border p-3 bg-light rounded">
                            {booking.returnNotes}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="d-flex justify-content-end">
                    {booking.status === 'Delivered' && booking.car?.type === 'Rent' && (
                      <button 
                        className="btn btn-primary me-2"
                        onClick={handleReturn}
                      >
                        Process Return
                      </button>
                    )}
                    <button 
                      className="btn btn-secondary"
                      onClick={() => navigate("/admin/bookings")}
                    >
                      Back to Bookings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;