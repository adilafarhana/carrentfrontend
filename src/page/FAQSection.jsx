import React, { useEffect, useState } from "react";
import axios from "axios";

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    axios
      .get("https://carrentbackend-1-tpmm.onrender.com/faqs", requestHeader)
      .then((response) => {
        console.log("Fetched FAQs:", response.data);
        setFaqs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
      });
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={styles.fullScreenContainer}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h1 style={styles.heading}>Frequently Asked Questions</h1>
          <p style={styles.subheading}>Find answers to common questions about our services</p>
          
          {faqs.length > 0 ? (
            <div style={styles.faqList}>
              {faqs.map((faq, index) => (
                <div 
                  key={faq._id} 
                  style={{
                    ...styles.faqItem,
                    ...(activeIndex === index ? styles.faqItemActive : {}),
                  }}
                  onClick={() => toggleFAQ(index)}
                >
                  <div style={styles.faqHeader}>
                    <h3 style={styles.question}>
                      <span style={styles.qMark}>Q:</span> {faq.question}
                    </h3>
                    <span style={styles.toggleIcon}>
                      {activeIndex === index ? '−' : '+'}
                    </span>
                  </div>
                  <div 
                    style={{
                      ...styles.answerContainer,
                      ...(activeIndex === index ? { maxHeight: '500px' } : { maxHeight: '0' }),
                    }}
                  >
                    <p style={styles.answer}>
                      <span style={styles.aMark}>A:</span> {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noDataContainer}>
              <p style={styles.noData}>No FAQs available at the moment.</p>
              <p style={styles.noDataSub}>Please check back later or contact our support team.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Standardized CSS styles
const styles = {
  fullScreenContainer: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  overlay: {
    width: "100%",
    maxWidth: "1200px",
  },
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "0.5rem",
    lineHeight: "1.2",
  },
  subheading: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#7f8c8d",
    marginBottom: "3rem",
    fontWeight: "400",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  faqItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    borderLeft: "5px solid #3498db",
    cursor: "pointer",
  },
  faqItemActive: {
    backgroundColor: "#f1f8ff",
    boxShadow: "0 5px 15px rgba(52, 152, 219, 0.2)",
  },
  faqHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
  },
  question: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0",
    flex: "1",
    display: "flex",
    alignItems: "center",
  },
  qMark: {
    color: "#3498db",
    fontWeight: "700",
    marginRight: "0.8rem",
    fontSize: "1.3rem",
  },
  aMark: {
    color: "#2ecc71",
    fontWeight: "700",
    marginRight: "0.8rem",
    fontSize: "1.3rem",
  },
  toggleIcon: {
    fontSize: "1.5rem",
    color: "#7f8c8d",
    fontWeight: "300",
    transition: "transform 0.3s ease",
  },
  answerContainer: {
    overflow: "hidden",
    transition: "max-height 0.3s ease",
    padding: "0 1.5rem",
  },
  answer: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6",
    padding: "0 0 1.5rem 0",
    margin: "0",
  },
  noDataContainer: {
    textAlign: "center",
    padding: "3rem 0",
  },
  noData: {
    fontSize: "1.2rem",
    color: "#7f8c8d",
    fontWeight: "500",
    marginBottom: "0.5rem",
  },
  noDataSub: {
    fontSize: "1rem",
    color: "#bdc3c7",
    fontStyle: "italic",
  },
  '@media (max-width: 768px)': {
    container: {
      padding: "20px",
    },
    heading: {
      fontSize: "1.8rem",
    },
    question: {
      fontSize: "1.1rem",
    },
    answer: {
      fontSize: "0.95rem",
    },
  },
};

export default FAQSection;