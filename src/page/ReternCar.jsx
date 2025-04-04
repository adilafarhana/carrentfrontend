import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navadmindashboard from "./Nav/Navadmindashboard";
import { ClipLoader } from "react-spinners";
import { BASE_URL } from "../constant";

const ReturnCar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.bookingData || null);
  const [loading, setLoading] = useState(!location.state?.bookingData);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Initialize returnTime with proper ISO string format
  const [formData, setFormData] = useState({
    returnCondition: "Good",
    returnNotes: "",
    returnTime: new Date().toISOString().slice(0, 16)
  });

  // Calculate balance due
  const [balanceDue, setBalanceDue] = useState(
    booking ? (booking.totalPrice - (booking.advancePayment || 0)) : 0
  );

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate expected return time based on booking details
  const calculateExpectedReturn = () => {
    if (!booking?.startTime || !booking?.duration) return null;
    
    const startTime = new Date(booking.startTime);
    let hoursToAdd = 0;
    
    switch(booking.selectedPeriod) {
      case "rentalPricePerHour":
        hoursToAdd = booking.duration;
        break;
      case "rentalPricePerday":
        hoursToAdd = booking.duration * 24;
        break;
      case "rentalPricePerweak":
        hoursToAdd = booking.duration * 24 * 7;
        break;
      case "rentalPricePermonth":
        hoursToAdd = booking.duration * 24 * 30;
        break;
      default:
        hoursToAdd = booking.duration * 24;
    }
    
    return new Date(startTime.getTime() + hoursToAdd * 60 * 60 * 1000);
  };

  // Calculate late penalty
  const calculatePenalty = (returnTime) => {
    try {
      if (!booking || !returnTime) return {
        isLate: false,
        hoursLate: 0,
        penaltyAmount: 0,
        minimumPenalty: (booking?.totalPrice - (booking?.advancePayment || 0)) * 0.2 || 0
      };

      const expectedReturn = calculateExpectedReturn();
      if (!expectedReturn) return {
        isLate: false,
        hoursLate: 0,
        penaltyAmount: 0,
        minimumPenalty: (booking?.totalPrice - (booking?.advancePayment || 0)) * 0.2 || 0
      };
      
      const actualReturn = new Date(returnTime);
      const expectedReturnTime = new Date(expectedReturn);
      
      // Calculate hours late (round up to nearest hour)
      const hoursLate = Math.max(0, Math.ceil((actualReturn - expectedReturnTime) / (1000 * 60 * 60)));
      
      if (hoursLate <= 0) {
        return {
          isLate: false,
          hoursLate: 0,
          penaltyAmount: 0,
          minimumPenalty: (booking.totalPrice - (booking.advancePayment || 0)) * 0.2
        };
      }

      // Calculate remaining balance
      const remainingBalance = booking.totalPrice - (booking.advancePayment || 0);

      // Calculate hourly rate based on booking period
      let hourlyRate;
      switch(booking.selectedPeriod) {
        case "rentalPricePerHour":
          hourlyRate = booking.totalPrice / booking.duration;
          break;
        case "rentalPricePerday":
          hourlyRate = booking.totalPrice / (booking.duration * 24);
          break;
        case "rentalPricePerweak":
          hourlyRate = booking.totalPrice / (booking.duration * 24 * 7);
          break;
        case "rentalPricePermonth":
          hourlyRate = booking.totalPrice / (booking.duration * 24 * 30);
          break;
        default:
          hourlyRate = booking.totalPrice / (booking.duration * 24);
      }

      // Calculate penalty (1.5x hourly rate per hour late, minimum 20% of remaining balance)
      const calculatedPenalty = Math.max(
        remainingBalance * 0.2,
        hourlyRate * 1.5 * hoursLate
      );

      // Cap penalty at remaining balance
      const finalPenalty = Math.min(calculatedPenalty, remainingBalance);

      return {
        isLate: true,
        hoursLate: hoursLate,
        penaltyAmount: Math.round(finalPenalty * 100) / 100,
        minimumPenalty: Math.round(remainingBalance * 0.2 * 100) / 100,
        expectedReturn: expectedReturn.toISOString()
      };
    } catch (error) {
      console.error("Penalty calculation error:", error);
      return {
        isLate: false,
        hoursLate: 0,
        penaltyAmount: 0,
        minimumPenalty: (booking?.totalPrice - (booking?.advancePayment || 0)) * 0.2 || 0,
        expectedReturn: null
      };
    }
  };

  const [penaltyDetails, setPenaltyDetails] = useState(
    calculatePenalty(formData.returnTime)
  );

  // Update balance due when penalty changes
  useEffect(() => {
    if (booking) {
      const newBalanceDue = (booking.totalPrice - (booking.advancePayment || 0)) + penaltyDetails.penaltyAmount;
      setBalanceDue(newBalanceDue);
    }
  }, [penaltyDetails, booking]);

  useEffect(() => {
    if (booking && formData.returnTime) {
      setPenaltyDetails(calculatePenalty(formData.returnTime));
    }
  }, [formData.returnTime, booking]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "returnTime") {
      if (booking?.startTime) {
        const selectedReturn = new Date(value);
        const startTime = new Date(booking.startTime);
        
        if (selectedReturn < startTime) {
          setError("Return time cannot be before rental start time");
          return;
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: value.slice(0, 16) }));
      setError("");
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

// ... (previous imports remain the same)

const handleReturn = async () => {
  try {
    setProcessing(true);
    setError('');
    setSuccess('');
  
    const formattedReturnTime = new Date(formData.returnTime).toISOString();
    
    const payload = {
      id: booking._id,
      status: 'Returned',
      returnCondition: formData.returnCondition,
      returnNotes: formData.returnNotes,
      returnTime: formattedReturnTime,
      penaltyAmount: penaltyDetails.penaltyAmount,
      balanceDue: balanceDue,
      // Add car ID to update its status
      carId: booking.car?._id
    };

    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/updateOrderStatus`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data.message === 'Status updated successfully') {
      const updatedBooking = response.data.booking;
      setBooking(updatedBooking);
      setSuccess('Car returned successfully!');
      
      setPenaltyDetails({
        isLate: updatedBooking.hoursLate > 0,
        hoursLate: updatedBooking.hoursLate,
        penaltyAmount: updatedBooking.lateFee,
        minimumPenalty: (booking.totalPrice - (booking.advancePayment || 0)) * 0.2,
        expectedReturn: calculateExpectedReturn()?.toISOString()
      });

      setBalanceDue(updatedBooking.balanceDue || 
        (updatedBooking.totalPrice - (updatedBooking.advancePayment || 0)) + 
        (updatedBooking.lateFee || 0));
    } else {
      setError(response.data.message || 'Return processing failed');
    }
  } catch (err) {
    console.error('Return error:', err);
    let errorMessage = 'Failed to process return';
    if (err.response) {
      errorMessage = err.response.data?.message || err.message;
    } else if (err.request) {
      errorMessage = 'Network error - could not connect to server';
    }
    setError(errorMessage);
  } finally {
    setProcessing(false);
  }
};

// ... (rest of the component remains the same)

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column" 
      }}>
        <ClipLoader color="#3498db" size={50} />
        <p className="mt-3">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5 text-center">
        <Navadmindashboard />
        <div className="alert alert-danger">
          <h4>No Booking Data Found</h4>
          <p>Please go back and select a booking to process return</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate("/admin/bookings")}
          >
            Go to Bookings
          </button>
        </div>
      </div>
    );
  }

  const expectedReturn = calculateExpectedReturn();
  const rentalPeriodLabel = booking.selectedPeriod === "rentalPricePerHour" ? "Hour(s)" :
                          booking.selectedPeriod === "rentalPricePerday" ? "Day(s)" :
                          booking.selectedPeriod === "rentalPricePerweak" ? "Week(s)" :
                          booking.selectedPeriod === "rentalPricePermonth" ? "Month(s)" : "Day(s)";

  return (
    <div className="container mt-4">
      <Navadmindashboard />
      <h2 className="text-center mb-4">Car Return Process</h2>
      
      {error && (
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-secondary mt-2"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {success ? (
        <div className="alert alert-success">
          <h4>{success}</h4>
          <div className="mt-3">
            <h5>Payment Summary</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Original Balance Due:</strong> ₹{(booking.totalPrice - (booking.advancePayment || 0)).toFixed(2)}</p>
                {penaltyDetails.penaltyAmount > 0 && (
                  <>
                    <p><strong>Hours Late:</strong> {penaltyDetails.hoursLate}</p>
                    <p><strong>Late Return Penalty:</strong> ₹{penaltyDetails.penaltyAmount.toFixed(2)}</p>
                  </>
                )}
              </div>
              <div className="col-md-6">
                <p className="fw-bold"><strong>Final Balance Due:</strong> ₹{balanceDue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <button 
            className="btn btn-success mt-3"
            onClick={() => navigate("/admin/bookings")}
          >
            Back to Bookings
          </button>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4>Booking Details</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Customer:</strong> {booking.fullName || "N/A"}</p>
                  <p><strong>Email:</strong> {booking.email || "N/A"}</p>
                  <p><strong>Phone:</strong> {booking.phone || "N/A"}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Car:</strong> {booking.car?.brand} {booking.car?.model}</p>
                  <p><strong>Rental Period:</strong> {booking.duration} {rentalPeriodLabel}</p>
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="row mt-3">
                <div className="col-md-6">
                  <p><strong>Rental Start Time:</strong> {formatDisplayDate(booking.startTime)}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Expected Return:</strong> {expectedReturn ? formatDisplayDate(expectedReturn) : "N/A"}</p>
                </div>
              </div>

              <div className="row mt-3 border-top pt-3">
                <div className="col-md-6">
                  <p><strong>Advance Payment:</strong> ₹{(booking.advancePayment || 0).toFixed(2)}</p>
                </div>
                <div className="col-md-6">
                  <p className="fw-bold">
                    <strong>Current Balance Due:</strong> ₹{(booking.totalPrice - (booking.advancePayment || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Return Details</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Actual Return Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleInputChange}
                  required
                  min={booking.startTime ? new Date(booking.startTime).toISOString().slice(0, 16) : undefined}
                />
                {penaltyDetails.isLate && (
                  <div className="alert alert-warning mt-2">
                    <strong>Late Return Detected!</strong>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Hours Late:</strong> {penaltyDetails.hoursLate}</p>
                        <p><strong>Minimum Penalty (20%):</strong> ₹{penaltyDetails.minimumPenalty.toFixed(2)}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Calculated Penalty:</strong> ₹{penaltyDetails.penaltyAmount.toFixed(2)}</p>
                        <p><strong>Penalty Rate:</strong> 1.5x hourly rate</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Car Condition</label>
                <select
                  name="returnCondition"
                  className="form-select"
                  value={formData.returnCondition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Excellent">Excellent (No issues)</option>
                  <option value="Good">Good (Minor wear)</option>
                  <option value="Fair">Fair (Noticeable wear)</option>
                  <option value="Poor">Poor (Significant wear)</option>
                  <option value="Damaged">Damaged (Needs repair)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Return Notes</label>
                <textarea
                  name="returnNotes"
                  className="form-control"
                  rows="3"
                  value={formData.returnNotes}
                  onChange={handleInputChange}
                  placeholder="Describe any damages, issues, or special notes..."
                ></textarea>
              </div>

              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Final Balance Due</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Original Balance:</strong> ₹{(booking.totalPrice - (booking.advancePayment || 0)).toFixed(2)}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Late Penalty:</strong> ₹{penaltyDetails.penaltyAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="row mt-2 border-top pt-2">
                    <div className="col-md-12">
                      <h5 className="text-end">
                        <strong>Total Balance Due:</strong> ₹{balanceDue.toFixed(2)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  className={`btn btn-${penaltyDetails.isLate ? 'warning' : 'primary'} btn-lg`}
                  onClick={handleReturn}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : penaltyDetails.isLate ? (
                    `Confirm Return with ₹${balanceDue.toFixed(2)} Total Due`
                  ) : (
                    `Confirm Return with ₹${balanceDue.toFixed(2)} Due`
                  )}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate("/Adminbookingdetails")}
                >
                  Cancel
                </button> 
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnCar;