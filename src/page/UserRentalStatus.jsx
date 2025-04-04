import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navrent from "./Nav/Navrent";
import { BASE_URL } from "../constant";

const UserRentalStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `${BASE_URL}/userBookings/${userId}`,
          requestHeader
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserBookings();
  }, []);

  const formatDuration = (startTime, endTime) => {
    if (!startTime) return "Not started";
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    const diffMs = end - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffDays}d ${diffHrs}h ${diffMins}m`;
  };

  return (
    <div style={styles.container}>
      <Navrent />
      <h2 style={styles.heading}>Your Rental Status</h2>
      
      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You have no active bookings.</p>
      ) : (
        <div style={styles.bookingsContainer}>
          {bookings.map((booking, index) => (
            <div key={index} style={styles.bookingCard}>
              <h3>{booking.car?.brand} {booking.car?.model}</h3>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Start Time:</strong> {booking.startTime ? new Date(booking.startTime).toLocaleString() : "Not started"}</p>
              <p><strong>Duration:</strong> {formatDuration(booking.startTime, booking.returnTime)}</p>
              
              {booking.status === "Delivered" && (
                <>
                  <p><strong>Time Remaining:</strong> {formatRemainingTime(booking)}</p>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        width: `${calculateUsagePercentage(booking)}%`,
                        backgroundColor: calculateUsagePercentage(booking) > 90 ? '#dc3545' : '#28a745',
                        height: '20px',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                </>
              )}
              
              {booking.status === "Returned" && (
                <>
                  <p><strong>Return Time:</strong> {new Date(booking.returnTime).toLocaleString()}</p>
                  <p><strong>Final Charges:</strong> ₹{booking.finalCharges || 0}</p>
                  <p><strong>Balance Due:</strong> ₹{booking.balanceDue > 0 ? booking.balanceDue : 0}</p>
                  {booking.balanceDue < 0 && (
                    <p><strong>Refund Amount:</strong> ₹{Math.abs(booking.balanceDue)}</p>
                  )}
                  <p><strong>Condition:</strong> {booking.returnCondition}</p>
                  <p><strong>Notes:</strong> {booking.returnNotes}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatRemainingTime = (booking) => {
  if (!booking.startTime || !booking.duration) return "N/A";
  
  const startTime = new Date(booking.startTime);
  const endTime = new Date(startTime.getTime() + booking.duration * 60 * 60 * 1000);
  const now = new Date();
  
  if (now >= endTime) {
    return "Overdue!";
  }
  
  const diffMs = endTime - now;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}m remaining`;
};

const calculateUsagePercentage = (booking) => {
  if (!booking.startTime || !booking.duration) return 0;
  
  const startTime = new Date(booking.startTime);
  const endTime = new Date(startTime.getTime() + booking.duration * 60 * 60 * 1000);
  const now = new Date();
  
  const totalDuration = endTime - startTime;
  const usedDuration = now - startTime;
  
  return Math.min(100, (usedDuration / totalDuration) * 100);
};

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  heading: { textAlign: 'center', marginBottom: '30px' },
  bookingsContainer: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  bookingCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    flex: '1 1 300px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    margin: '10px 0'
  }
};

export default UserRentalStatus;