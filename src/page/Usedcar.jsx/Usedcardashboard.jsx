import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navused from "../Nav/Navused";

const Usedcardashboard = () => {
  const [usedCars, setUsedCars] = useState([]);
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
      
      const usedCarsData = carsResponse.data.filter((car) => car.type === "Used");
      setBookings(bookingsResponse.data);
      updateCarStatusesAutomatically(usedCarsData, bookingsResponse.data);
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
  
    setUsedCars(updatedCars);
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
      <Navused />

   <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Used Car Platform</h1>
        <p>Find quality pre-owned vehicles at great prices!</p>
      </header>

      {/* Image Carousel */}
      <div id="usedCarCarousel" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#usedCarCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#usedCarCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#usedCarCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/used_hero.jpg" className="d-block w-100" alt="Used Cars" style={{ height: "500px", objectFit: "cover" }} />
          </div>
          <div className="carousel-item">
            <img src="https://www.autotrader.com/wp-content/uploads/2021/06/buying-a-used-car.jpg" className="d-block w-100" alt="Used Cars" style={{ height: "500px", objectFit: "cover" }} />
          </div>
          <div className="carousel-item">
            <img src="https://hips.hearstapps.com/hmg-prod/images/10best-cars-group-cropped-1542126037.jpg" className="d-block w-100" alt="Used Cars" style={{ height: "500px", objectFit: "cover" }} />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#usedCarCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#usedCarCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container my-5">
        <h2 className="text-center mb-4">Featured Used Car Brands</h2>
        <div className="row text-center">
          {[
            { name: "Toyota", img: "https://www.carlogos.org/car-logos/toyota-logo.png" },
            { name: "Honda", img: "https://www.carlogos.org/car-logos/honda-logo.png" },
            { name: "Ford", img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
            { name: "Chevrolet", img: "https://www.carlogos.org/car-logos/chevrolet-logo.png" },
            { name: "Nissan", img: "https://www.carlogos.org/car-logos/nissan-logo.png" },
            { name: "Hyundai", img: "https://www.carlogos.org/car-logos/hyundai-logo.png" }
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

      {/* Used Car Listings Section */}
      <section id="usedCarListings" className="container mt-5">
        <h2 className="text-center mb-4">Available Used Cars</h2>
        <div className="row">
          {usedCars.length > 0 ? (
            usedCars.map((car) => (
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
                      <strong>Price:</strong> {car.price} USD
                    </p>
                    <p className="card-text">
                      <strong>Year:</strong> {car.year || 'N/A'}
                    </p>
                    <p className="card-text">
                      <strong>Mileage:</strong> {car.mileage || 'N/A'} km
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
                        <div className="text-muted small mt-1">(Currently reserved)</div>
                      )}
                    </p>
                    <div className="mt-auto">
                      {car.status === "Available" ? (
                        <>
                          <button 
                            onClick={() => navigate(`/car-details/${car._id}`, { state: { id: car._id }})}
                            className="btn btn-primary w-100 mb-2"
                          >
                            Booking now
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
                          Currently unavailable for purchase
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
                No used cars available at the moment. Please check back later.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-light py-5 mt-5">
        <div className="container">
          <h2 className="text-center mb-4">Why Buy Used?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-cash-stack fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Better Value</h5>
                  <p className="card-text">Save money with lower prices and slower depreciation compared to new cars.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Certified Quality</h5>
                  <p className="card-text">All our used cars undergo rigorous inspections to ensure quality.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-file-text fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Full History</h5>
                  <p className="card-text">Complete vehicle history reports available for all our used cars.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-3">
              <h5>About Us</h5>
              <p>We specialize in providing quality used cars with transparent pricing and history.</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Contact</h5>
              <p>Email: usedcars@example.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Location: Ernakulam, India</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white">Home</Link></li>
                <li><Link to="/used" className="text-white">Used Cars</Link></li>
                <li><Link to="/rent" className="text-white">Rent a Car</Link></li>
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
            &copy; {new Date().getFullYear()} Used Cars Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Usedcardashboard;