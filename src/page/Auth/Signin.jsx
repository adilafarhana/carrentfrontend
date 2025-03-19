import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  const readValue = async (data) => {
    if (!data.email || !data.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("https://carrentbackend-rnpp.onrender.com/login", data);
      if (response.data.status === "Success") {
        console.log(response)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("useremail", data.email);
        localStorage.setItem("name", data.name);
        localStorage.setItem("isAdmin",response?.data?.isAdmin || false);
        
        alert("LOGGED IN");
       if(response.data?.isAdmin == true )
        { 
          return navigate("/admin")
        }
        else{         
          navigate("/maindashboard");
        }
      } else {
        setErrorMessage(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:"rgba(255, 255, 255, 0.8)",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      {/* Home Link */}
      <Link
        to="/"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "rgba(255, 255, 255, 0.8)",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Home
      </Link>

      {/* Login Form Box */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          color: "black",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "black" }}>Login</h2>

        {/* Error Message */}
        {errorMessage && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(readValue)}>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              style={{
                fontWeight: "bold",
                color: "black",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              className="form-control"
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                },
              })}
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "8px",
                outline: "none",
                fontSize: "16px",
                background: "rgba(255, 255, 255, 0.8)",
                color: "black",
              }}
            />
            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              style={{
                fontWeight: "bold",
                color: "black",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 3, message: "Min 5 characters" },
              })}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "8px",
                outline: "none",
                fontSize: "16px",
                background: "rgba(255, 255, 255, 0.3)",
                color: "black",
              }}
            />
            {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password.message}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-success"
            style={{
              width: "100%",
              padding: "12px",
              background: "#4CAF50",
              color: "white",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.3s",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>

        {/* Sign-Up Link */}
        <div style={{ marginTop: "15px", fontSize: "14px" }}>
          <p>
            Don't have an account?
            <Link
              to="/signup"
              style={{
                color: "blue",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
