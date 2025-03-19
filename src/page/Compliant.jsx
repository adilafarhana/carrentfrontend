import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navrent from "./Nav/Navrent";

const Complaint = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    ComplaintType: "",
    PriorityLevel: "Select",
    DateFilled: new Date().toISOString().split("T")[0], // Set default value as today's date
    ContactNo: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const inputHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.ComplaintType.trim()) newErrors.ComplaintType = "Complaint is required";
    if (!data.PriorityLevel || data.PriorityLevel === "Select")
      newErrors.PriorityLevel = "Please select a priority level";
    if (!data.DateFilled) newErrors.DateFilled = "Date is required";
    if (!data.ContactNo.trim()) {
      newErrors.ContactNo = "Contact No is required";
    } else if (!/^\d{10}$/.test(data.ContactNo)) {
      newErrors.ContactNo = "Contact No must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage
      const payload = {
        ...data,
        userid: userId, // Include user ID in the payload
        DateFilled: new Date(data.DateFilled).toISOString().split("T")[0], // Ensure valid date format
      };

      console.log("Submitting Complaint Data:", payload); // Log the payload

      axios
        .post("https://carrentbackend-1-tpmm.onrender.com/complaints", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          if (response.data.status === "success") {
            alert("Complaint Submitted Successfully!");
            setData({
              name: "",
              ComplaintType: "",
              PriorityLevel: "Select",
              DateFilled: "",
              ContactNo: "",
            });
            setErrors({});
          } else {
            alert("Error in submission.");
          }
        })
        .catch((error) => {
          console.error("Error submitting complaint:", error);
        });
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navrent />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          width:"1500px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h1
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              textAlign: "center",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            Complaints Form
          </h1>
          <div className="row g-3">
            {/* Name Input */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={data.name}
                onChange={inputHandler}
              />
              {errors.name && <span className="text-danger">{errors.name}</span>}
            </div>

            {/* Complaint Type Input */}
            <div className="col-md-6">
              <label className="form-label">Complaint</label>
              <input
                type="text"
                className="form-control"
                name="ComplaintType"
                value={data.ComplaintType}
                onChange={inputHandler}
              />
              {errors.ComplaintType && (
                <span className="text-danger">{errors.ComplaintType}</span>
              )}
            </div>

            {/* Priority Level Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Priority Level</label>
              <select
                className="form-select"
                name="PriorityLevel"
                value={data.PriorityLevel}
                onChange={inputHandler}
              >
                <option value="Select">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.PriorityLevel && (
                <span className="text-danger">{errors.PriorityLevel}</span>
              )}
            </div>

            {/* Date Field Input */}
            <div className="col-md-6">
              <label className="form-label">Date Filed</label>
              <input
                type="date"
                className="form-control"
                name="DateFilled"
                value={data.DateFilled}
                onChange={inputHandler}
              />
              {errors.DateFilled && (
                <span className="text-danger">{errors.DateFilled}</span>
              )}
            </div>

            {/* Contact No Input */}
            <div className="col-md-6">
              <label className="form-label">Contact No</label>
              <input
                type="text"
                className="form-control"
                name="ContactNo"
                value={data.ContactNo}
                onChange={inputHandler}
              />
              {errors.ContactNo && (
                <span className="text-danger">{errors.ContactNo}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-12 text-center">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>

            {/* View Complaints Button */}
            <div className="col-12 text-center mt-3">
              <button
                className="btn btn-purple"
                style={{ backgroundColor: "purple", color: "white" }}
                onClick={() => navigate("/user/complaint")}
              >
                View Complaints
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;