import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 10%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "black" }}>
          Contact Us
        </h1>
        

        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "5px" }}>Contact Details</h3>
          <p style={{ margin: "5px 0" }}><strong>Email:</strong> support@vehiclemarket.com</p>
          <p style={{ margin: "5px 0" }}><strong>Phone:</strong> +123 456 7890</p>
          <p style={{ margin: "5px 0" }}><strong>Address:</strong>  koyilandy, Kozhikode, kerala,India</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
