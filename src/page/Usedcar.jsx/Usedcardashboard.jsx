import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import Navrent from "../Nav/Navrent";
import axios from "axios";

const Usedcardashboard = () => {
  const [rentCars, setRentCars] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:3030/cars", { type: "Rent" })
      .then((response) => {
        setRentCars(response.data);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  }, []);

  return (
    <>
      <Navrent />

      <header className="bg-primary text-white text-center py-5">
        <h1>Rent a Car Easily</h1>
        <p>Find the best rental deals tailored to your needs!</p>
      </header>


      <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" class="d-block w-100" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div className="container my-5">
        <h2 className="text-center mb-4">Our Car Rental Brands</h2>
        <div id="brandCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner text-center">
            <div className="carousel-item active">
              <div className="d-flex justify-content-center">
                <img src="https://www.carlogos.org/car-logos/lamborghini-logo.png" className="brand-logo img-fluid mx-3" alt="Lamborghini" />
                <img src="https://www.carlogos.org/car-logos/rolls-royce-logo.png" className="brand-logo img-fluid mx-3" alt="Rolls Royce" />
                <img src="https://www.carlogos.org/car-logos/mercedes-benz-logo.png" className="brand-logo img-fluid mx-3" alt="Mercedes" />
                <img src="https://www.carlogos.org/car-logos/tesla-logo.png" className="brand-logo img-fluid mx-3" alt="Tesla" />
                <img src="https://www.carlogos.org/car-logos/toyota-logo.png" className="brand-logo img-fluid mx-3" alt="Toyota" />
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* Car Listings Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Available Rental Cars</h2>
        <div className="row">
          {rentCars.length > 0 ? (
            rentCars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card">
                  <Link to={`/car-details/${car._id}`} state={{ id: car?._id }}>
                    {car.images.length > 0 && (
                      <img
                        src={`http://localhost:3030${car.images[0]}`}
                        alt={car.model}
                        className="card-img-top"
                      />
                    )}
                  </Link>
                  <div className="card-body">
                    <h5>
                      {car.brand}
                    </h5>
                    <p>
                      <strong>Price per Hour:</strong> ₹{car.rentalPricePerHour}
                    </p>
                    <button>
                 
  <Link to={`/car-reviews/${car._id}`} style={{ textDecoration: "none", color: "inherit" }}>
    View Review
  </Link>
</button>


                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No rental cars available.</p>
          )}
        </div>
      </section>

    </>
  );
};

export default Usedcardashboard;
