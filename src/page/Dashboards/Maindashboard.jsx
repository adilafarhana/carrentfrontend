import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavHome from "../Nav/NavHome";
import FAQSection from "../FAQSection";

const Maindashboard = () => {
  const location = useLocation();
  const { title, content, images } = location.state || {};
  const [Blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://carrentbackend-1-tpmm.onrender.com/Blogs")
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog details:", error));
  }, []);

  return (
    <>
      <NavHome />

      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Car Marketplace</h1>
        <p>Your one-stop platform for hassle-free car rentals and used car sales!</p>
        
      </header>

      {/* Carousel Section */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://www.progressivetourtravels.com/images/car-banner.jpg" className="d-block w-100" alt="Car Banner" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Car Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Car Slide 3" />
          </div>
        </div>
      </div>

      {/* Car Brand Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Popular Car Brands</h2>
        <div className="row text-center">
          {[
            { name: "volkswagen", img: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
            { name: "hyundai", img: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
            { name: "Ford", img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
            { name: "BMW", img: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
            { name: "benz", img: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
            { name: "KIA", img: "https://www.carlogos.org/car-logos/kia-logo.png" }
          ].map((brand, index) => (
            <div key={index} className="col-md-2 mb-3">
              <div className="card p-3">
                <img src={brand.img} alt={brand.name} className="card-img-top" style={{ height: "100px", objectFit: "contain" }} />
                <div className="card-body">
                  <h6 className="card-title">{brand.name}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Blogs Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Latest Blogs</h2>
        <div className="row">
          {Blogs.length > 0 ? (
            Blogs.map((Blog) => (
              <div key={Blog._id} className="col-md-4 mb-4">
                <div className="card">
                  {Blog?.images?.length > 0 && (
                    <img src={`https://carrentbackend-1-tpmm.onrender.com/${Blog.images[0]}`} alt={Blog.title} className="card-img-top img-fluid" />
                  )}
                  <div className="card-body">
                    <h5>{Blog.title}</h5>
                    <p>{Blog.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container my-5">
        <FAQSection />
      </div>

      {/* Footer Section */}
      <footer
        style={{
          backgroundColor: "#000000", // Black background
          color: "#ffffff", // White text
          padding: "40px 20px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>About Us</h4>
            <p>We are the leading online vehicle marketplace offering car sales, rentals, and best-in-class customer support.</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>Contact</h4>
            <p>Email: support@car-marketplace.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Ernakulam, India</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>Rent a Car</h4>
            <p>Choose from a wide range of cars for rent, from economy to luxury.</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>Used Cars</h4>
            <p>Browse our collection of quality pre-owned cars at unbeatable prices.</p>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #444",
          }}
        >
          &copy; 2025 Car Marketplace | All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Maindashboard;