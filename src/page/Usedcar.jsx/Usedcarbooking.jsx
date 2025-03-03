import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Usedcarbooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (location.state?.car) {
      setCar(location.state.car);
    } else {
      setErrorMessage("Car details not available. Please try again.");
    }
  }, [location.state]);
  

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitBooking = async (data) => {
    if (!car) {
      setErrorMessage("Car details not available. Please try again.");
      return;
    }

    const bookingData = {
      car,
      bookingDetails: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3030/postPurchase",
        bookingData,
        requestHeader
      );

      if (response.status === 201) {
        alert("Booking Confirmed!");
        navigate("/booking-confirmation", { state: bookingData });
      } else {
        setErrorMessage("Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      {!car ? (
        <p className="text-danger text-center">{errorMessage}</p>
      ) : (
        <>
          <h2 className="text-center">{car.brand} {car.model}</h2>
          <div className="card mx-auto text-center shadow p-3" style={{ maxWidth: "800px" }}>
            {car.images?.length > 0 && (
              <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} className="card-img-top" />
            )}
            <div className="card-body">
              <p><strong>Brand:</strong> {car.brand}</p>
              <p><strong>Model:</strong> {car.model}</p>
              <p><strong>Price:</strong> ₹{car.price}</p>
              <p><strong>Description:</strong> {car.description || "No description available."}</p>

              <div className="mt-4">
                <h5>Book This Car</h5>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <form onSubmit={handleSubmit(submitBooking)}>
                  <div className="mb-2">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("fullName", { required: "Name is required" })}
                    />
                    {errors.fullName && <p className="text-danger">{errors.fullName.message}</p>}
                  </div>

                  <div className="mb-2">
                    <label>Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                  </div>

                  <div className="mb-2">
                    <label>Phone:</label>
                    <input
                      type="number"
                      className="form-control"
                      {...register("phone", { required: "Phone number is required" })}
                    />
                    {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
                  </div>
                  
                  <div className="mb-2">
                    <label>Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("address", { required: "Address is required" })}
                    />
                    {errors.address && <p className="text-danger">{errors.address.message}</p>}
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Confirm Booking
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Usedcarbooking;
