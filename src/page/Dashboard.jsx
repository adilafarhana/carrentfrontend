import React from "react";
import Nav from "./Nav";

const carImages = [
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826557_150913_1_1738847942911.jpg?q=80", 
  "https://imgd.aeplcdn.com/300x225/vimages/202501/3813234_150913_1_1738163524911.jpg?q=80", 
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826512_150913_1_1738847525619.jpg?q=80"
];

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
  },
  {
    image: "https://puntacanarentacar.com/wp-content/uploads/punta-cana-renta-car-punta.jpg",
    title: "Blog Post 3",
    description: "First rental experience was smooth—easy booking, quick pick-up, and a great ride! Highly recommend!"
  }
];

const Dashboard = () => {
  return (
    <>
      <Nav />

      {/* Internal CSS */}
      <style>
        {`
          .brand-logo {
            width: 120px;
            height: auto;
          }

          .carousel-item {
            display: flex;
            justify-content: center;
            align-items: center;
          }

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

          .bg-primary {
            background-color: #007bff;
          }

          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
          }
        `}
      </style>

      {/* Header Section */}
      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Car Marketplace</h1>
        <p>Your one-stop platform for hassle-free car rentals, used car sales, and more!</p>
      </header>

      {/* Carousel Section */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[1, 2, 3].map((num, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
              <img
                src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg"
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

      {/* Car Rental Brands Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Our Car Rental Brands</h2>
        <div id="brandCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner text-center">
            <div className="carousel-item active">
              <div className="d-flex justify-content-center">
                <img src="https://www.carlogos.org/car-logos/lamborghini-logo.png" className="brand-logo mx-3" alt="Lamborghini" />
                <img src="https://www.carlogos.org/car-logos/rolls-royce-logo.png" className="brand-logo mx-3" alt="Rolls Royce" />
                <img src="https://www.carlogos.org/car-logos/mercedes-benz-logo.png" className="brand-logo mx-3" alt="Mercedes" />
                <img src="https://www.carlogos.org/car-logos/tesla-logo.png" className="brand-logo mx-3" alt="Tesla" />
                <img src="https://www.carlogos.org/car-logos/toyota-logo.png" className="brand-logo mx-3" alt="Toyota" />
              </div>
            </div>
            <div className="carousel-item">
              <div className="d-flex justify-content-center">
                <img src="https://www.carlogos.org/car-logos/chevrolet-logo.png" className="brand-logo mx-3" alt="Chevrolet" />
                <img src="https://www.carlogos.org/car-logos/audi-logo.png" className="brand-logo mx-3" alt="Audi" />
                <img src="https://www.carlogos.org/car-logos/bmw-logo.png" className="brand-logo mx-3" alt="BMW" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Listings Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Cars for Sale</h2>
        <div className="row">
          {carImages.map((image, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={image} className="card-img-top" alt={`Car ${index + 1}`} />
                <div className="card-body">
                  <p className="card-text">
                    Second Hand MG Astor Savvy 1.3 Turbo AT S Red [2021-2023] in Ahmedabad
                  </p>
                  <a href="#" className="btn btn-primary">View Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hyundai Special Offer Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Special Offers</h2>
        <div className="d-flex justify-content-center">
          <img src="https://org2.hyundai.com/content/dam/hyundai/in/en/data/build-a-car/special-offers/march-offer-pc.jpg" className="img-fluid" alt="Hyundai Special Offer" />
        </div>
      </div>

      {/* Latest Blogs Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Latest Blogs</h2>
        <div className="row">
          {blogs.map((blog, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={blog.image} className="card-img-top" alt={blog.title} />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{blog.description}</p>
                  <a href="#" className="btn btn-primary">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
