import React, { useState, useEffect } from "react";
import axios from "axios";
import Navadmindashboard from "./Nav/Navadmindashboard";

const AdminFAQ = () => {
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "General" });
  const [faqs, setFaqs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentFAQId, setCurrentFAQId] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get("https://carrentbackend-1-tpmm.onrender.com/faqs", requestHeader);
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`https://carrentbackend-1-tpmm.onrender.com/editFAQ/${currentFAQId}`, newFAQ, requestHeader);
        alert("FAQ updated successfully!");
      } else {
        await axios.post("https://carrentbackend-1-tpmm.onrender.com/postfaqs", newFAQ, requestHeader);
        alert("FAQ added successfully!");
      }
      setNewFAQ({ question: "", answer: "", category: "General" });
      setEditMode(false);
      setCurrentFAQId(null);
      window.location.reload(); // Refresh to get updated FAQs
    } catch (error) {
      console.error("Error submitting FAQ:", error);
    }
  };

  const handleEdit = (faq) => {
    setNewFAQ({ question: faq.question, answer: faq.answer, category: faq.category });
    setEditMode(true);
    setCurrentFAQId(faq._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axios.delete(`https://carrentbackend-1-tpmm.onrender.com/deleteFAQ/${id}`, requestHeader);
      alert("FAQ deleted successfully!");
      setFaqs(faqs.filter((faq) => faq._id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <div className="container mt-4">
      <Navadmindashboard />
      <h2 className="text-center mb-4">Admin - Manage FAQs</h2>

      {/* FAQ Form */}
      <div className="card shadow p-4 mb-4">
        <h4>{editMode ? "Edit FAQ" : "Add FAQ"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Question:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter FAQ question"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Answer:</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter answer"
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Category:</label>
            <select
              className="form-select"
              value={newFAQ.category}
              onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Buying">Buying</option>
              <option value="Renting">Renting</option>
              <option value="Payments">Payments</option>
              <option value="Pricing">Pricing</option>
            </select>
          </div>
          <button className="btn btn-primary w-100" type="submit">
            {editMode ? "Update FAQ" : "Add FAQ"}
          </button>
        </form>
      </div>

      {/* Existing FAQs List */}
      <h3 className="mb-3">Existing FAQs</h3>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-muted">No FAQs available.</p>
      ) : (
        <ul className="list-group">
          {faqs.map((faq) => (
            <li key={faq._id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold">{faq.question}</h6>
                <p className="mb-1">{faq.answer}</p>
                <span className="badge bg-secondary">{faq.category}</span>
              </div>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(faq)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(faq._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFAQ;
