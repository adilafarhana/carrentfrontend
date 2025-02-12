import React from "react";
import { useParams } from "react-router-dom";

const blog = [
  {
    image: "https://www.bmtscorp.com/wp-content/uploads/2024/01/taipei-car-rental-gharry.webp",
    title: "My Hassle-Free Rental Car Experience",
    description: "Renting a car was super easy! Quick booking, clean car, and smooth pickup. Great experience all around!",
    content: "Full content of the blog goes here with more details about the experience."
  },
  {
    image: "https://ara.al/wp-content/uploads/2024/04/2149571900.jpg",
    title: "A Perfect Road Trip with My Rental Car",
    description: "The rental car was ideal—comfortable, fuel-efficient, and hassle-free. Highly recommend for stress-free travel!",
    content: "Detailed description of a perfect road trip with the rental car."
  },
  {
    image: "https://puntacanarentacar.com/wp-content/uploads/punta-cana-renta-car-punta.jpg",
    title: "Blog Post 3",
    description: "First rental experience was smooth—easy booking, quick pick-up, and a great ride! Highly recommend!",
    content: "A detailed blog post about the smooth rental experience and a fantastic ride."
  }
];

const Blogdetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const blog = blogs[id]; // Fetch the blog by ID

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <img src={blog.image} className="card-img-top" alt={blog.title} />
            <div className="card-body">
              <h5 className="card-title">{blog.title}</h5>
              <p className="card-text">{blog.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogdetails;
