import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavHome from "./Nav/NavHome";
// import Navrent from "../Nav/Navrent";


const Usedcarblog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: [],
 
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [Blogs, setBlogs] = useState([]);
  const navigate = useNavigate();


  const requestHeader =  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3030/getblogs",requestHeader);
      const data = await response.data
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({ ...prevData, images: files }));
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content  || formData.images.length === 0) {
      alert("Please fill in all fields and upload images.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((image) => formDataToSend.append("images", image));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("http://localhost:3030/uploadblog", formDataToSend,requestHeader);

      alert(response?.data?.message || "blog uploaded successfully!");

      fetchBlogs()

    } catch (error) {
      console.error("Error saving blog details:", error);
      alert(`Error uploading blog details: ${error.message}`);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const response = await axios.delete(`http://localhost:3030/deleteblog/${blogId}`, requestHeader);
      alert(response.data.message || "Blog deleted successfully!");
  
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      alert(`Error deleting blog: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="container">
      <NavHome/>
      {/* <Navrent/> */}
      <h2>Upload blog Details</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="title"
          placeholder="blog title"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <input
          type="text"
          name="content"
          placeholder="content"
          onChange={handleChange}
          value={formData.content}
          required
        />
        
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        {imagePreviews.length > 0 && (
          <div className="image-previews">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} width="100" />
            ))}
          </div>
        )}
        <button type="submit">Upload blog</button>
      </form>

      <h3>Uploaded blog</h3>
      <table className="car-table">
        <thead>
          <tr>
            <th>title</th>
            <th>content</th>
       
          </tr>
        </thead>
        <tbody>
          {Blogs.length > 0 ? (
            Blogs.map((Blog) => (
              <tr key={Blog._id}>
                <td>{Blog.title}</td>
                <td>{Blog.content}</td>
                <td>
                  <button onClick={() => handleDelete(Blog._id)} className="btn btn-danger">
                    Delete
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Blogs uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          max-width: 100000px;
          margin: 0 auto;
          padding: 30px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h2, h3 {
          text-align: center;
          color: #333;
        }

        .form-container input, 
        .form-container textarea, 
        .form-container select {
          width: 100%;
          margin-bottom: 15px;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }

        .form-container button {
          background-color: #007bff;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
          font-size: 16px;
        }

        .form-container button:hover {
          background-color: #0056b3;
        }

        .image-previews {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .image-previews img {
          border-radius: 8px;
        }

        .car-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .car-table th, .car-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .car-table th {
          background-color: #f4f4f4;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          cursor: pointer;
        }

        .btn-danger {
          background-color: red;
          color: white;
        }

        .btn-danger:hover {
          background-color: darkred;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px;
          }

          .form-container input, 
          .form-container textarea, 
          .form-container select {
            padding: 10px;
            font-size: 14px;
          }

          .form-container button {
            padding: 10px 18px;
          }

          .image-previews {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Usedcarblog;
