import React from "react";

const AboutUs = () => {
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
          maxWidth: "1200px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          textAlign: "justify",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          About Our Vehicle Marketplace
        </h1>
        
        <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#333" }}>
          Our platform is designed to provide a seamless and user-friendly experience for vehicle 
          sales and rentals. With AI-driven pricing, users can buy or rent vehicles at competitive 
          rates based on real-time market demand. The platform ensures secure transactions and 
          efficient management for both buyers and sellers.
        </p>
        
        <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#333" }}>
          Key features of our marketplace include car sales with secure transactions, real-time 
          car rentals, user-generated reviews and blogs, and an admin dashboard for streamlined 
          management. These features are aimed at enhancing user engagement and making vehicle 
          ownership and rentals more accessible and hassle-free.
        </p>

        <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#333" }}>
          Our project focuses on various areas, including Car Sales & Listings, Car Rentals, 
          AI-based Dynamic Pricing, Admin Management, User Engagement, and Secure Transactions. 
          With an intuitive interface, users can explore and book vehicles effortlessly, while 
          administrators can manage the listings and ensure smooth operations.
        </p>

        <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#333" }}>
          The technology stack powering our platform consists of React.js for the frontend, 
          Node.js and Express.js for the backend, and MongoDB for the database. Additionally, 
          we employ AI models such as ARIMA and LSTM to optimize pricing based on market 
          fluctuations and user demand trends.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
