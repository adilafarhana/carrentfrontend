import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navrent from "../Nav/Navrent";

const Rendcardashboard = () => {
  const [rentCars, setRentCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carsResponse, bookingsResponse] = await Promise.all([
        axios.get("https://carrentbackend-1-tpmm.onrender.com/getcars", requestHeader),
        axios.post("https://carrentbackend-1-tpmm.onrender.com/getbooking", {}, requestHeader)
      ]);
      
      const rentalCars = carsResponse.data.filter((car) => car.type === "Rent");
      setBookings(bookingsResponse.data);
      updateCarStatusesAutomatically(rentalCars, bookingsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCarStatusesAutomatically = (carsData, bookingsData) => {
    const updatedCars = carsData.map(car => {
      // Check for active bookings (excluding Returned and Cancelled statuses)
      const activeBookings = bookingsData.filter(booking => 
        booking.car?._id === car._id && 
        !["Returned", "Cancelled"].includes(booking.status));
      
      // Determine new status
      const newStatus = activeBookings.length > 0 ? "Not Available" : "Available";
      
      // Only update if status has changed
      if (car.status !== newStatus) {
        // Update the backend immediately
        axios.put(
          `https://carrentbackend-1-tpmm.onrender.com/updatestatus/${car._id}`,
          { status: newStatus },
          requestHeader
        ).catch(err => console.error("Error updating car status:", err));
        
        return { ...car, status: newStatus };
      }
      return car;
    });
  
    setRentCars(updatedCars);
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds to keep status updated
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navrent />

      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Rent car Platform</h1>
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
      {/* Car Listings Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Available Rental Cars</h2>
        <div className="row">
          {rentCars.length > 0 ? (
            rentCars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  {car.images?.length > 0 && (
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      <img 
                        src={`https://carrentbackend-1-tpmm.onrender.com${car.images[0]}`} 
                        alt={car.model} 
                        className="card-img-top h-100 w-100 object-fit-cover"
                        style={car.status !== "Available" ? { opacity: 0.5 } : {}}
                      />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{car.brand} {car.model}</h5>
                    <p className="card-text">
                      <strong>Rental Price:</strong> {car.rentalPricePerHour} USD/hour
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> 
                      <span 
                        className={`badge ${car.status === "Available" ? "bg-success" : "bg-danger"}`}
                        style={{ marginLeft: "8px" }}
                      >
                        {car.status}
                      </span>
                      {car.status === "Not Available" && (
                        <div className="text-muted small mt-1">(Currently booked)</div>
                      )}
                    </p>
                    <div className="mt-auto">
                      {car.status === "Available" ? (
                        <>
                          <button 
                            onClick={() => navigate(`/car-details/${car._id}`, { state: { id: car._id }})}
                            className="btn btn-primary w-100 mb-2"
                          >
                            Book Now
                          </button>
                          <Link 
                            to={`/car-reviews/${car._id}`} 
                            className="btn btn-outline-secondary w-100"
                          >
                            View Reviews
                          </Link>
                        </>
                      ) : (
                        <div className="alert alert-warning text-center mb-0">
                          Currently unavailable for booking
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No rental cars available at the moment. Please check back later.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-3">
              <h5>About Us</h5>
              <p>We are the leading online vehicle marketplace offering car rentals and best-in-class customer support.</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Contact</h5>
              <p>Email: support@car-rental.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Location: Ernakulam, India</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white">Home</Link></li>
                <li><Link to="/rent" className="text-white">Rent a Car</Link></li>
                <li><Link to="/used" className="text-white">Used Cars</Link></li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li><Link to="/terms" className="text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-3 border-top">
            &copy; {new Date().getFullYear()} Car Rental Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Rendcardashboard;