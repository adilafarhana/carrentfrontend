import React from "react";
import Nav from "../Nav/Nav";

const blogs = [
  {
    image: "https://www.bmtscorp.com/wp-content/uploads/2024/01/taipei-car-rental-gharry.webp",
    title: "My Hassle-Free Rental Car Experience",
    description: "Renting a car was super easy! Quick booking, clean car, and smooth pickup. Great experience all around!"
  },
  {
    image: "https://ara.al/wp-content/uploads/2024/04/2149571900.jpg",
    title: "A Perfect Road Trip with My Rental Car",
    description: "The rental car was ideal—comfortable, fuel-efficient, and hassle-free. Highly recommend for stress-free travel!"
  }
];

const Dashboard = () => {
  return (
    <>
      <Nav />

      <style>
        {`
          .card {
            margin-bottom: 20px;
          }
          .card-img-top {
            object-fit: cover;
            height: 225px;
          }
          .text-center {
            text-align: center;
          }
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
          }
          .section-title {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
          }
          .marquee-text {
            font-size: 18px;
            font-weight: bold;
            color: white;
            background-color: #000000;
            padding: 10px;
          }
          .footer {
            background-color: #222;
            color: white;
            padding: 30px 0;
            text-align: center;
            margin-top: 50px;
          }
          .footer-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }
          .footer-section {
            margin: 10px;
            max-width: 250px;
          }
          .footer-section h4 {
            color: #007bff;
          }
          .footer-section p, .footer-section a {
            color: #ddd;
            text-decoration: none;
            font-size: 14px;
          }
          .footer-section a:hover {
            color: #fff;
          }
          .footer-bottom {
            margin-top: 20px;
            font-size: 14px;
            border-top: 1px solid #444;
            padding-top: 10px;
          }
        `}
      </style>

      {/* Header Section */}
      <h2 className="text-center mt-4">Welcome to the Best Car Marketplace</h2>

      {/* Marquee Section */}
      <marquee className="marquee-text" behavior="scroll" direction="left">
        🚗 Limited Time Offers! Rent a Tesla Model 3 at ₹1200/hour! | 🚙 Huge Discounts on Used Cars! | 🏎️ Book Your Dream Ride Now!
      </marquee>

      {/* Carousel Section */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[1, 2, 3].map((num, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
              <img
                src="https://www.progressivetourtravels.com/images/car-banner.jpg"
                className="d-block w-100"
                alt={`Car ${num}`}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>We are the leading online vehicle marketplace offering car sales, rentals, and best-in-class customer support.</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@car-marketplace.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Ernakulam, India</p>
          </div>
          <div className="footer-section">
            <h4>Rent a Car</h4>
            <p>Choose from a wide range of cars for rent, from economy to luxury.</p>
            <a href="/rentals">View Rental Options</a>
          </div>
          <div className="footer-section">
            <h4>Used Cars</h4>
            <p>Browse our collection of quality pre-owned cars at unbeatable prices.</p>
            <a href="/used-cars">Explore Used Cars</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 Car Marketplace | All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
