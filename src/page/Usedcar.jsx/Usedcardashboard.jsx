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
  const fetchRentalCars = async () => {
    try {
      const response = await axios.get("http://localhost:3030/getcars", requestHeader);
      const rentalCars = response.data.filter(car => car.type === "Rent");
      setCars(rentalCars);
    } catch (error) {
      console.error("Error fetching rental cars:", error);
    }
  };
  
  useEffect(() => {
    fetchRentalCars();
  }, []);
  
  return (
    <>
      <Navrent />

      <header className="bg-primary text-white text-center py-5">
        <h1>Rent a Car Easily</h1>
        <p>Find the best rental deals tailored to your needs!</p>
      </header>

      {/* Image Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Slide 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Car Brand Logos */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Our Car Rental Brands</h2>
        <div id="brandCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner text-center">
            <div className="carousel-item active">
              <div className="d-flex justify-content-center">
                {["lamborghini", "rolls-royce", "mercedes-benz", "tesla", "toyota"].map((brand) => (
                  <img key={brand} src={`https://www.carlogos.org/car-logos/${brand}-logo.png`} className="brand-logo img-fluid mx-3" alt={brand} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Listings Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Rental Cars</h2>
        <div className="row">
          {rentCars.length > 0 ? (
            rentCars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card">
                  {/* Conditionally render the Link only if the car is Available */}
                  {car.status === "Available" ? (
                    <Link to={`/car-details/${car._id}`} state={{ id: car._id }}>
                      {car.images?.length > 0 && (
                        <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} className="card-img-top" />
                      )}
                    </Link>
                  ) : (
                    car.images?.length > 0 && (
                      <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} className="card-img-top" style={{ opacity: 0.6 }} />
                    )
                  )}

                  <div className="card-body">
                    <h5>{car.brand}</h5>
                    <p><strong>Price per Hour:</strong> ₹{car.rentalPricePerHour}</p>
                    <p><strong>Status:</strong> {car.status}</p>

                    {/* Conditionally disable the review button if the car is not available */}
                    {car.status === "Available" ? (
                      <Link to={`/car-reviews/${car._id}`} className="btn btn-primary">View Review</Link>
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
            <p className="text-center">No rental cars available.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Usedcardashboard;
