import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navrent from "../Nav/Navrent";

const BlogUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchBlogs = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const response = await axios.get(
        `http://localhost:3030/getblogs?user=${userId}`,
        requestHeader
      );
      setBlogs(response.data);
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
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    if (!formData.title || !formData.content || formData.images.length === 0) {
      alert("Please fill in all fields and upload images.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("user", userId);
    formData.images.forEach((image) => formDataToSend.append("images", image));

    try {
      await axios.post("http://localhost:3030/uploadblog", formDataToSend, requestHeader);
      alert("Blog uploaded successfully!");
      setFormData({ title: "", content: "", images: [] });
      setImagePreviews([]);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog details:", error);
      alert(`Error uploading blog details: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:3030/deleteblog/${id}`, requestHeader);
        alert("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Error deleting blog");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-gray-100">
      <Navrent />
      <div className="w-full max-w-lg bg-[#1E293B] p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Upload Rent Car Blog
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            value={formData.title}
            required
          /><br></br><br></br>
          <textarea
            name="content"
            placeholder="Blog Content"
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
            onChange={handleChange}
            value={formData.content}
            required
          /><br></br><br></br>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            required
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg shadow-md" />
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Upload Blog
          </button>
        </form>
      </div>

      <h3 className="text-xl font-semibold text-white mt-10">Uploaded Blogs</h3>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full max-w-4xl">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-[#1E293B] p-4 shadow-lg rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-2">{blog.title}</h4>
              <p className="text-gray-300 mb-3">{blog.content}</p>
              <div className="grid grid-cols-2 gap-2">
                {/* {blog.images?.map((img, index) => (
                  <img key={index} src={img} alt="Blog" className="w-full h-24 object-cover rounded-lg shadow" />
                ))} */}
              </div>
              <button
                onClick={() => handleDelete(blog._id)}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 mt-4">No blogs uploaded yet.</p>
      )}
    </div>
  );
};

export default BlogUpload;
