import React, { useState, useEffect } from "react";
import axios from "axios";

const Viewrentblogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch the blog data when the component is mounted
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3030/getblogs");
        console.log(response.data); // Check if the data is being fetched
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Rental Car Blogs</h2>
      <div className="row">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="col-md-4 mb-4">
              <div className="card">
                {blog.image && (
                  <img
                    src={`http://localhost:3030/${blog.image}`} // Ensure the image path is correct
                    alt={blog.title}
                    className="card-img-top"
                  />
                )}
                <div className="card-body">
                  <h5>{blog.title}</h5>
                  <p>{blog.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available.</p> // Show this when no blogs are found
        )}
      </div>
    </div>
  );
};

export default Viewrentblogs;
