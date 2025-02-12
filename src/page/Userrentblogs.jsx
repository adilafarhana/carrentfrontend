import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Userrentblogs = () => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlog({ ...blog, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog.title || !blog.content) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);
    if (blog.image) formData.append("image", blog.image);

    try {
      await axios.post("http://localhost:3030/uploadblog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog uploaded successfully!");
      navigate("/viewrentblog");
    } catch (error) {
      console.error("Error uploading blog:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Upload Your Blog</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Blog Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            rows="5"
            value={blog.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
        </div>

        {preview && (
          <div className="mb-3">
            <h6>Image Preview:</h6>
            <img src={preview} alt="Preview" style={{ width: '100px', height: 'auto' }} />
          </div>
        )}

        <button type="submit" className="btn btn-primary">Upload Blog</button>
      </form>
    </div>
  );
};

export default Userrentblogs;
