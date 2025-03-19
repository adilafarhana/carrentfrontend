import React, { useState, useEffect } from "react";
import axios from "axios";
import Navadmindashboard from "./Nav/Navadmindashboard";

const Admincomplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  // Fetch all complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:3030/complaintList", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to fetch complaints. Please check the backend server.");
    }
  };

  // Update complaint status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3030/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.status === "success") {
        fetchComplaints(); // Refresh the list
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete a complaint
  const handleDeleteComplaint = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3030/complaints/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.status === "success") {
        fetchComplaints(); // Refresh the list
      } else {
        console.error("Failed to delete complaint:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <div>
      <Navadmindashboard/>
      <h1>Complaint Management</h1>
      {error && <p style={{ color: "red", width:"100px",height:"100px"}}>{error}</p>}
      <table className="table" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Complaint</th>
            <th>Priority</th>
            <th>Date Filed</th>
            <th>Contact No</th>
            <th>Status</th>
            <th>Action</th>
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
              <td>
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteComplaint(complaint._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admincomplaints;