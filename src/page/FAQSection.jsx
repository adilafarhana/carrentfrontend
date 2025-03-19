import React, { useEffect, useState } from "react";
import axios from "axios";

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    axios
      .get("http://localhost:3030/faqs", requestHeader)
      .then((response) => {
        console.log("Fetched FAQs:", response.data); // Debugging
        setFaqs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
      });
  }, []);

  return (
    <div style={styles.fullScreenContainer}>
      <h1>Frequently Asked Questions</h1>
      <div style={styles.overlay}>
        <div style={styles.container}>
          {faqs.length > 0 ? (
            <div style={styles.faqList}>
              {faqs.map((faq) => (
                <div key={faq._id} style={styles.faqItem}>
                  <h3 style={styles.question}>Q: {faq.question}</h3>
                  <p style={styles.answer}>A: {faq.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noData}>No FAQs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline CSS for FAQ section styling
const styles = {
  fullScreenContainer: {
    minHeight: "100vh",
    backgroundImage: "url('https://via.placeholder.com/1920x1080')", // Replace with your image URL
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    maxWidth: "1200px",
    width: "90%",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  faqItem: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    cursor: "pointer",
    borderLeft: "4px solid #007bff",
  },
  faqItemHover: {
    transform: "translateY(-5px)",
  },
  question: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#007bff",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  answer: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.6",
    marginLeft: "10px",
  },
  noData: {
    textAlign: "center",
    fontSize: "18px",
    color: "#999",
    fontStyle: "italic",
  },
};

export default FAQSection;