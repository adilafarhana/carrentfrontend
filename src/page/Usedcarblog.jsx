import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavHome from "./Nav/NavHome";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const ImagePreviews = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const BlogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border: 1px solid #ddd;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: left;
`;

const NoBlogsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

// Main Component
const Usedcarblog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://carrentbackend-1-tpmm.onrender.com/getblogs",
        requestHeader
      );
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs. Please try again.");
    } finally {
      setIsLoading(false);
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
    
    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    
    // Clean up preview URLs when component unmounts or when new files are selected
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || formData.images.length === 0) {
      alert("Please fill in all fields and upload at least one image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formData.images.forEach((image) => formDataToSend.append("images", image));

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://carrentbackend-1-tpmm.onrender.com/uploadblog",
        formDataToSend,
        requestHeader
      );

      alert(response?.data?.message || "Blog uploaded successfully!");
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        images: [],
      });
      setImagePreviews([]);
      
      // Refresh blogs list
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog details:", error);
      alert(`Error uploading blog: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.delete(
        `https://carrentbackend-1-tpmm.onrender.com/deleteblog/${blogId}`,
        requestHeader
      );
      alert(response.data.message || "Blog deleted successfully!");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(`Error deleting blog: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavHome />
      <Container>
        <Title>Create New Blog Post</Title>
        
        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="text"
            name="title"
            placeholder="Blog Title"
            onChange={handleChange}
            value={formData.title}
            required
          />
          
          <TextArea
            name="content"
            placeholder="Blog Content"
            onChange={handleChange}
            value={formData.content}
            required
          />
          
          <Input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          
          {imagePreviews.length > 0 && (
            <ImagePreviews>
              {imagePreviews.map((src, index) => (
                <PreviewImage
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                />
              ))}
            </ImagePreviews>
          )}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Blog"}
          </Button>
        </FormContainer>

        <Title>Blog Posts</Title>
        
        {isLoading && blogs.length === 0 ? (
          <NoBlogsMessage>Loading blogs...</NoBlogsMessage>
        ) : blogs.length > 0 ? (
          <BlogTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Content</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.content}</TableCell>
                  <TableCell>
                    <DangerButton
                      onClick={() => handleDelete(blog._id)}
                      disabled={isLoading}
                    >
                      Delete
                    </DangerButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </BlogTable>
        ) : (
          <NoBlogsMessage>No blogs uploaded yet.</NoBlogsMessage>
        )}
      </Container>
    </>
  );
};

export default Usedcarblog;