import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constant';
import { ClipLoader } from 'react-spinners';
import { 
  FaCar, 
  FaUser, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaClock, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const UserReturnDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [penaltyDetails, setPenaltyDetails] = useState({
    isLate: false,
    hoursLate: 0,
    penaltyAmount: 0,
    minimumPenalty: 0
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(`${BASE_URL}/bookings/returns/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 10000
        });

        if (!response.data) {
          throw new Error('Empty response from server');
        }

        // Handle different response structures
        const responseData = response.data.data || response.data.booking || response.data;
        
        if (!responseData) {
          throw new Error('Invalid response format');
        }

        setBooking(responseData);
        
        // Set penalty details with fallback calculations
        if (responseData.penaltyDetails) {
          setPenaltyDetails(responseData.penaltyDetails);
        } else {
          const remainingBalance = (responseData.totalPrice || 0) - (responseData.advancePayment || 0);
          const hoursLate = responseData.hoursLate || 0;
          const lateFee = responseData.lateFee || 0;
          
          setPenaltyDetails({
            isLate: hoursLate > 0,
            hoursLate: hoursLate,
            penaltyAmount: lateFee,
            minimumPenalty: remainingBalance * 0.2
          });
        }
      } catch (err) {
        console.error('Error fetching return details:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to load return details. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReturnDetails();
  }, [id]);

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      setPaymentError('');
      
      // In a real app, replace this with actual API call
      // Example:
      // const response = await axios.post(`${BASE_URL}/payments`, {
      //   bookingId: booking._id,
      //   amount: balanceDue
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful payment
      setPaymentSuccess(true);
      
      // In a real app, you might want to update the booking status here
      // by making another API call or refreshing the data
    } catch (err) {
      console.error('Payment processing failed:', err);
      setPaymentError(
        err.response?.data?.message || 
        err.message || 
        'Payment failed. Please try again.'
      );
      setPaymentSuccess(false);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setPaymentProcessing(false);
    setPaymentError('');
    
    // If payment was successful, refresh the data
    if (paymentSuccess) {
      window.location.reload();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getRentalPeriodLabel = (period) => {
    if (!period) return "Hour(s)";
    switch(period) {
      case "rentalPricePerHour": return "Hour(s)";
      case "rentalPricePerday": return "Day(s)";
      case "rentalPricePerweak": return "Week(s)";
      case "rentalPricePermonth": return "Month(s)";
      default: return "Hour(s)";
    }
  };

  const calculateExpectedReturn = () => {
    if (!booking?.date || !booking?.duration) return null;
    
    const startTime = new Date(booking.date);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <ClipLoader color="#3498db" size={50} />
        <p className="mt-3">Loading return details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Return Details</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>No Return Details Found</h4>
          <p>We couldn't find any return details for this booking.</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const expectedReturn = calculateExpectedReturn();
  const balanceDue = (booking.totalPrice || 0) - (booking.advancePayment || 0) + (penaltyDetails.penaltyAmount || 0);

  return (
    <div className="container py-4">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {paymentSuccess ? 'Payment Successful' : 
                   paymentError ? 'Payment Error' : 'Confirm Payment'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} disabled={paymentProcessing}></button>
              </div>
              <div className="modal-body text-center">
                {paymentProcessing ? (
                  <div className="d-flex flex-column align-items-center">
                    <ClipLoader color="#3498db" size={50} />
                    <p className="mt-3">Processing payment...</p>
                  </div>
                ) : paymentError ? (
                  <div className="d-flex flex-column align-items-center">
                    <FaTimesCircle className="text-danger mb-3" size={50} />
                    <h4>Payment Failed</h4>
                    <p>{paymentError}</p>
                  </div>
                ) : paymentSuccess ? (
                  <div className="d-flex flex-column align-items-center">
                    <FaCheckCircle className="text-success mb-3" size={50} />
                    <h4>Payment Successful!</h4>
                    <p>₹{balanceDue.toFixed(2)} has been paid successfully.</p>
                  </div>
                ) : (
                  <>
                    <p>You are about to pay ₹{balanceDue.toFixed(2)} for this booking.</p>
                    <p>Do you want to proceed with the payment?</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {!paymentProcessing && !paymentSuccess && !paymentError && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handlePayment}
                    >
                      Confirm Payment
                    </button>
                  </>
                )}
                {(paymentSuccess || paymentError) && (
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={closeModal}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <FaCar className="me-2" />
              Return Details for {booking.car?.brand} {booking.car?.model}
            </h2>
            <button 
              className="btn btn-light btn-sm"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="me-1" />
              Back
            </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row">
            {/* Trip Information */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h4 className="mb-0">
                    <FaCalendarAlt className="me-2" />
                    Trip Information
                  </h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h5 className="text-primary">Car Details</h5>
                    <p><strong>Model:</strong> {booking.car?.brand || 'N/A'} {booking.car?.model || 'N/A'}</p>
                    <p><strong>Type:</strong> {booking.car?.type || 'N/A'}</p>
                    <p><strong>Rental Type:</strong> {getRentalPeriodLabel(booking.selectedPeriod)}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-primary">Booking Details</h5>
                    <p><strong>Start Date:</strong> {formatDate(booking.date)}</p>
                    <p><strong>Duration:</strong> {booking.duration || 0} {getRentalPeriodLabel(booking.selectedPeriod)}</p>
                    <p><strong>Expected Return:</strong> {expectedReturn ? formatDate(expectedReturn) : 'N/A'}</p>
                    <p><strong>Base Price:</strong> ₹{(booking.totalPrice || 0).toFixed(2)}</p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-primary">Customer Information</h5>
                    <p><strong>Name:</strong> {booking.user?.name || booking.fullName || 'N/A'}</p>
                    <p><strong>Email:</strong> {booking.user?.email || booking.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {booking.user?.phone || booking.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Return Information */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h4 className="mb-0">
                    <FaClock className="me-2" />
                    Return Information
                  </h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h5 className="text-primary">Status</h5>
                    <span className={`badge ${booking.status === 'Returned' ? 'bg-success' : 'bg-warning'}`}>
                      {booking.status || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-primary">Return Details</h5>
                    <p><strong>Return Time:</strong> {formatDate(booking.returnTime)}</p>
                    <p><strong>Car Condition:</strong> {booking.returnCondition || 'Not specified'}</p>
                    {booking.returnNotes && (
                      <p><strong>Notes:</strong> {booking.returnNotes}</p>
                    )}
                  </div>
                  
                  {penaltyDetails.isLate && (
                    <div className="mb-3 alert alert-warning">
                      <h5 className="text-warning">
                        <FaExclamationTriangle className="me-2" />
                        Late Return Penalty
                      </h5>
                      <p><strong>Hours Late:</strong> {penaltyDetails.hoursLate.toFixed(1)}</p>
                      <p><strong>Penalty Amount:</strong> ₹{penaltyDetails.penaltyAmount.toFixed(2)}</p>
                      <p><small className="text-muted">(Minimum penalty: ₹{penaltyDetails.minimumPenalty.toFixed(2)})</small></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Summary */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">
                <FaMoneyBillWave className="me-2" />
                Payment Summary
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Base Price</strong></td>
                      <td className="text-end">₹{(booking.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td><strong>Advance Payment</strong></td>
                      <td className="text-end">- ₹{(booking.advancePayment || 0).toFixed(2)}</td>
                    </tr>
                    {penaltyDetails.isLate && (
                      <tr>
                        <td><strong>Late Penalty</strong></td>
                        <td className="text-end">+ ₹{penaltyDetails.penaltyAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="table-active">
                      <td><strong>Total Amount Due</strong></td>
                      <td className="text-end fw-bold">
                        ₹{balanceDue.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Payment History */}
          {booking.payments && booking.payments.length > 0 && (
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Payment History</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.payments.map((payment, index) => (
                        <tr key={index}>
                          <td>{formatDate(payment.createdAt || payment.paymentDate)}</td>
                          <td>₹{(payment.amount || 0).toFixed(2)}</td>
                          <td>{payment.paymentType || 'Standard'}</td>
                          <td>
                            <span className={`badge ${payment.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                              {payment.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-between mt-4">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="me-2" />
              Back to My Bookings
            </button>
            
            {balanceDue > 0 && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowPaymentModal(true)}
                disabled={booking.status === 'Paid'}
              >
                {booking.status === 'Paid' ? (
                  'Balance Paid'
                ) : (
                  `Pay Outstanding Balance (₹${balanceDue.toFixed(2)})`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReturnDetails;