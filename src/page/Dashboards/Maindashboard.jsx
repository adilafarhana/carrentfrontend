import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavHome from "../Nav/NavHome";
import Navrent from "../Nav/Navrent";

const Maindashboard = () => {
  const location = useLocation();
  const { title, content, images } = location.state || {};
  const [Blogs, setBlogs] = useState([]);
  const carImages = [
    "https://imgd.aeplcdn.com/300x225/vimages/202502/3826557_150913_1_1738847942911.jpg?q=80", 
    "https://imgd.aeplcdn.com/300x225/vimages/202501/3813234_150913_1_1738163524911.jpg?q=80", 
    "https://imgd.aeplcdn.com/300x225/vimages/202502/3826512_150913_1_1738847525619.jpg?q=80"
  ];

  useEffect(() => {
    fetch("http://localhost:3030/Blogs")  
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
              src="https://www.progressivetourtravels.com/images/car-banner.jpg"
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

      <div className="container my-5">
        <h2 className="text-center mb-4">Cars for Sale</h2>
        <div className="row">
          {carImages.map((image, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={image} className="card-img-top" alt={`Car ${index + 1}`} />
                <div className="card-body">
                  <p className="card-text">Great deals on second-hand cars!</p>
                  <a href="#" className="btn btn-primary">View Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container my-5">
        <h2 className="text-center mb-4">Latest Blogs</h2>
        <div className="row">
          {Blogs.length > 0 ? (
            Blogs.map((Blog) => (
              <div key={Blog._id} className="col-md-4 mb-4">
                <div className="card">
                  {Blog?.images?.length > 0 && (
                    <img src={`http://localhost:3030${Blog.images[0]}`} alt={Blog.title} className="card-img-top img-fluid" />
                  )}
                  <div className="card-body">
                    <h5>{Blog.title}</h5>
                    <p>{Blog.content}</p>
                    <a href={`https://wa.me/?text=Interested%20in%20${Blog.title}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Maindashboard;