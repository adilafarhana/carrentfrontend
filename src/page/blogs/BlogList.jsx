import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navrent from "../Nav/Navrent";

const BlogList = () => {
  const location = useLocation();
  const { title, content, images } = location.state || {};  
  const [Blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3030/Blogs")  
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog details:", error));
  }, []);

  return (
    <>
    <Navrent/>
      <section id="blogDetails" className="container mt-5">
        <h2>{title}</h2>
        <p>{content}</p>
        {images && images.length > 0 && (
          <div className="image-gallery">
            {images.map((image, index) => (
              <img key={index} src={`http://localhost:3030${image}`} alt={`Blog image ${index}`} className="img-fluid" />
            ))}
          </div>
        )}
      </section>

      <section id="blogs" className="container mt-5">
        <h2 className="text-center mb-4">Blogs</h2>
        <div className="row">
          {Blogs.length > 0 ? (
            Blogs.map((Blog) => (
              <div key={Blog._id} className="col-md-4 mb-4">
                <div className="card">
                  {/* Displaying the first image of each blog */}
                  {Blog?.images?.length > 0 && (
                    <img src={`http://localhost:3030${Blog.images[0]}`} alt={Blog.title} className="card-img-top img-fluid" />
                  )}

                  <div className="card-body">
                    <h5>{Blog.title}</h5>
                    <p>{Blog.content}</p>

                    <a href={`https://wa.me/?text=Interested%20in%20${Blog.title}%20${Blog.content}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: "flex", alignItems: "center" }}>
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
      </section>
    </>
  );
};

export default BlogList;
