import React, { useState, useEffect } from "react";
import axios from "axios";
import Navadmindashboard from "./Nav/Navadmindashboard";

const Admincomplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Styles
  const styles = {
    container: {
      padding: "2rem",
      marginTop: "5rem", // Account for fixed navbar
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    header: {
      color: "#2c3e50",
      marginBottom: "1.5rem",
      textAlign: "center",
      fontSize: "2rem",
      fontWeight: "600",
    },
    error: {
      color: "#e74c3c",
      backgroundColor: "#fadbd8",
      padding: "1rem",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      borderRadius: "0.5rem",
    },
    tableHeader: {
      backgroundColor: "#2c3e50",
      color: "#ffffff",
      padding: "1rem",
      textAlign: "left",
    },
    tableRow: {
      borderBottom: "1px solid #e0e0e0",
      "&:nth-child(even)": {
        backgroundColor: "#f8f9fa",
      },
      "&:hover": {
        backgroundColor: "#f1f1f1",
      },
    },
    tableCell: {
      padding: "1rem",
      verticalAlign: "middle",
    },
    select: {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #ced4da",
      width: "100%",
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "#ffffff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#c0392b",
      },
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
    },
    statusPending: {
      color: "#e67e22",
      fontWeight: "500",
    },
    statusAccepted: {
      color: "#3498db",
      fontWeight: "500",
    },
    statusResolved: {
      color: "#2ecc71",
      fontWeight: "500",
    },
  };

  // Fetch all complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://carrentbackend-1-tpmm.onrender.com/complaintList", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to fetch complaints. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `https://carrentbackend-1-tpmm.onrender.com/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.status === "success") {
        setComplaints(complaints.map(c => 
          c._id === id ? {...c, status} : c
        ));
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete a complaint
  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const response = await axios.delete(
          `https://carrentbackend-1-tpmm.onrender.com/complaints/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (response.data.status === "success") {
          setComplaints(complaints.filter(c => c._id !== id));
        } else {
          console.error("Failed to delete complaint:", response.data.message);
        }
      } catch (error) {
        console.error("Error deleting complaint:", error);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return styles.statusPending;
      case "accepted": return styles.statusAccepted;
      case "resolved": return styles.statusResolved;
      default: return {};
    }
  };

  return (
    <div>
      <Navadmindashboard />
      <div style={styles.container}>
        <h1 style={styles.header}>Complaint Management</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        {loading ? (
          <div style={styles.loading}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Complaint</th>
                  <th style={styles.tableHeader}>Priority</th>
                  <th style={styles.tableHeader}>Date Filed</th>
                  <th style={styles.tableHeader}>Contact No</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <tr key={complaint._id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{complaint.name}</td>
                      <td style={styles.tableCell}>{complaint.ComplaintType}</td>
                      <td style={styles.tableCell}>{complaint.PriorityLevel}</td>
                      <td style={styles.tableCell}>
                        {new Date(complaint.DateFilled).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>{complaint.ContactNo}</td>
                      <td style={styles.tableCell}>
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                          style={styles.select}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <span style={{ marginLeft: "0.5rem", ...getStatusStyle(complaint.status) }}>
                          {complaint.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDeleteComplaint(complaint._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ ...styles.tableCell, textAlign: "center" }}>
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admincomplaints;