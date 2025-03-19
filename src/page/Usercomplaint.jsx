import React, { useState, useEffect } from "react";
import axios from "axios";

const Usercomplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  // Fetch complaints for the logged-in user
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage
      const response = await axios.get(`https://carrentbackend-1-tpmm.onrender.com/ownComplaint`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(response.data.complaints);
      setError("");
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to fetch complaints. Please check the backend server.");
    }
  };

  return (
    <div>
      <h1>Your Complaints</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Complaint</th>
              <th>Priority</th>
              <th>Date Filed</th>
              <th>Contact No</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.name}</td>
                <td>{complaint.ComplaintType}</td>
                <td>{complaint.PriorityLevel}</td>
                <td>{complaint.DateFilled}</td>
                <td>{complaint.ContactNo}</td>
                <td>{complaint.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Usercomplaint;