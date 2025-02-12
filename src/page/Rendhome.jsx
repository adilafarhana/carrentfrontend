import React from "react";
import Nav from "./Nav";

const Dashboard = () => {
  return (
    <>
      <Nav />
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://2.bp.blogspot.com/-T_u7AixkhT8/TuXA0QKoMpI/AAAAAAAAFas/BDrVxQK_BLs/s1920/Audi-cars-wallpaper.JPG"
              className="d-block w-100"
              alt="Car 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://3.bp.blogspot.com/-tLDzWfrlteM/TyFotFs3ynI/AAAAAAAAAE4/5h1NBNs_ToI/s1600/car_HD_1.jpg"
              className="d-block w-100"
              alt="Car 2"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn.wallpapersafari.com/46/93/iNy7Ko.jpg"
              className="d-block w-100"
              alt="Car 3"
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Card Section */}
     
      
     
    </>
  );
};

export default Dashboard;
