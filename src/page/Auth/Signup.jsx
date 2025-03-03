import axios from "axios";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const navigate = useNavigate(); // Fix the navigation
    const password = useRef({});
    password.current = watch("password", ""); // Watch password field

    // onSubmit handler
    const onSubmit = (data) => {
        console.log(data);
        readValue(data);
    };

    const readValue = (data) => {
        if (!data.name || !data.email || !data.phone || !data.gender || !data.password || !data.confirmpassword) {
            alert("All fields are required!");
            return;
        }

        if (data.password !== data.confirmpassword) {
            alert("Passwords do not match");
            return;
        }

        // Post signup data
        axios.post("http://localhost:3030/signup", data)
            .then((response) => {
                if (response.data.status === "SIGNUP") {
                    alert("Registration successful");
                    navigate("/signin"); // Redirect to login after successful signup
                } else {
                    alert("Registration failed");
                }
            })
            .catch((error) => {
                console.error("Signup error:", error.response?.data || error.message);
                alert("Error: " + (error.response?.data?.message || "Internal Server Error"));
            });
    };

    return (
        <div
            style={{
                background:'#efdecd',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
            }}
        >
            <div className="container"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '15px',
                    padding: '30px',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
            >
                <h1 style={{ textAlign: 'center', color: '#000' }}>Signup</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        <div className="col-6">
                            <label className="form-label"><b>NAME</b></label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("name", { required: "This field is required" })}
                                placeholder="Enter your name"
                            />
                            {errors?.name?.message && <span>{errors?.name?.message}</span>}
                        </div>
                        <div className="col-6">
                            <label className="form-label"><b>EMAIL</b></label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("email", {
                                    required: "This field is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email",
                                    },
                                })}
                                placeholder="Enter your email"
                            />
                            {errors?.email?.message && <span>{errors?.email?.message}</span>}
                        </div>
                        <div className="col-6">
                            <label className="form-label"><b>PHONE</b></label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("phone", {
                                    required: "Phone number is required",
                                    minLength: { value: 10, message: "Min 10 numbers required" },
                                })}
                                placeholder="Enter your phone number"
                            />
                            {errors?.phone?.message && <span>{errors?.phone?.message}</span>}
                        </div>
                        <div className="col-6">
                            <label className="form-label"><b>GENDER</b></label>
                            <select
                                className="form-select"
                                {...register("gender")}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(5px)",
                                }}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="col-6">
                            <label className="form-label"><b>PASSWORD</b></label>
                            <input
                                type="password"
                                className="form-control"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 3, message: "Min 5 characters" },
                                })}
                                placeholder="Enter your password"
                            />
                            {errors?.password?.message && <span>{errors?.password?.message}</span>}
                        </div>
                        <div className="col-6">
                            <label className="form-label"><b>CONFIRM PASSWORD</b></label>
                            <input
                                type="password"
                                className="form-control"
                                {...register("confirmpassword", {
                                    required: "Confirm password is required",
                                    minLength: { value: 3, message: "Min 5 characters" },
                                    validate: (value) =>
                                        value === password.current || "The passwords do not match",
                                })}
                                placeholder="Confirm your password"
                            />
                            {errors?.confirmpassword?.message && <span>{errors?.confirmpassword?.message}</span>}
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                            <button className="btn btn-primary" type="submit">REGISTER</button>
                        </div>
                    </div>
                </form>

                <div className="col-12 d-flex justify-content-center">
                    <p><b>Already have an account?</b></p>
                    <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;

