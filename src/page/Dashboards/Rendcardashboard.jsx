import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navused from "../Nav/Navused";

const Rendcardashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { brand, model, price, description, type, images } = location.state || {};

  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:3030/cars", { type: "Used" })
      .then((response) => {
        setCars(response.data);
  
        // Fetch notifications and alert the user
        axios.get("http://localhost:3030/getnotication", requestHeader).then((notificationResponse) => {
          if (notificationResponse?.data) {
            alert(notificationResponse.data.map(notification => notification.message).join('\n'));
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  }, []);
  
  return (
    <>
      <Navused />
      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Car Rental Platform</h1>
        <p>Your one-stop shop for hassle-free car rentals, sales, and more!</p>
      </header>
    {/* Image Carousel */}
    <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>


      {/* Car Listings Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Cars</h2>
        <div className="row">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card">
                  {car.images.length > 0 && (
                    <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} className="card-img-top" />
                  )}
                  <div className="card-body">
                    <h5>{car.brand} {car.model}</h5>
                    <p>{car.description}</p>
                    <p><del>MRP: ₹{(car.price / (1 - car.discountPercentage / 100)).toFixed(2)}</del></p>
                    <p><strong>Discounted Price: ₹{car.price}</strong> ({car.discountPercentage}% OFF)</p>
                    {car.specialOffers && <p className="offer">🔥 {car.specialOffers}</p>}
                    <p><strong>Price:</strong> ₹{car.price}</p>
                    <p><strong>Status:</strong> {car.status}</p>

                    
                    
                    <button onClick={() => navigate(`/car-details/${car?._id}`, { state: { id: car?._id } })} className="btn btn-secondary">
                      Booking Now
                    </button>
                    <br /><br></br>
                    {car.status === "Available" ? (
                      <button className="btn btn-primary">
                        <Link to={`/car-reviews/${car._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          View Review
                        </Link>
                      </button>
                    ) : (
                      <button disabled className="btn btn-secondary" style={{ cursor: "not-allowed" }}>
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No cars available.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Rendcardashboard;