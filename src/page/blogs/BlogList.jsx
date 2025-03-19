import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BlogList = () => {
  const location = useLocation();
  const { title, content, images } = location.state || {};  
  const [Blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://carrentbackend-1-tpmm.onrender.com/Blogs")  
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog details:", error));
  }, []);

  return (
    <>
      <section id="blogDetails" className="container mt-5">
        <h2>{title}</h2>
        <p>{content}</p>
        {images && images.length > 0 && (
          <div className="image-gallery">
            {images.map((image, index) => (
              <img key={index} src={`https://carrentbackend-1-tpmm.onrender.com/${image}`} alt={`Blog image ${index}`} className="img-fluid" />
            ))}
          </div>
        )}
      </section>

      <section id="blogs" className="container mt-5">
        <h2 className="text-center mb-4">Blogs</h2>
        <div className="row">
          {Blogs.length > 0 ? (
            Blogs.map((Blog) => (
              <div key={Blog._id} className="col-md-4 mb-4" style={{width:"px"}}>
                <div className="card" >
                  {/* Displaying the first image of each blog */}
                  {Blog?.images?.length > 0 && (
                    <img src={`https://carrentbackend-1-tpmm.onrender.com/${Blog.images[0]}`} alt={Blog.title} className="card-img-top img-fluid" />
                  )}

                  <div className="card-body">
                    <h5>{Blog.title}</h5>
                    <p>{Blog.content}</p>

                    
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
