import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const CarDetails = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState({});
  const [loading, setLoading] = useState(!car);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const requestHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {

    const fetchCarDetails = async () => {
      try {
        setLoading(true)
        const id = location.state?.id
        const response = await axios.post(`http://localhost:3030/cardetails`, { id }, requestHeader);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setErrorMessage("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();

  }, []);

  const duration = watch("duration");
  useEffect(() => {
    if (duration && car) {
      setTotalPrice(duration * car.rentalPricePerHour);
    }
  }, [duration, car]);

  const submitBooking = async (data) => {
    const bookingData = {
      car,
      bookingDetails: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        date: data.date,
        time: data.time,
        duration: data.duration,
        totalPrice: totalPrice,
      },
    };

    try {
      const response = await axios.post("http://localhost:3030/postbooking", bookingData, requestHeader);
      if (response.status === 201) {
        alert("Booking Confirmed!");
        console.log(response?.data)
        navigate(`/booking-confirmation/${response?.data?.booking?._id }`, { state: { id:response?.data?.booking?._id } })
        // navigate("/car-details/${car?._id");
      } else {
        setErrorMessage("Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  if (loading) return (<div class="spinner-border m-5" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>)

  if (!car) return <p className="text-center">Car details not available.</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">{car.brand} {car.model}</h2>

      <div className="card mx-auto text-center shadow p-3" style={{ maxWidth: "800px" }}>
        {car.images?.length > 0 && (
          <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} className="card-img-top" />
        )}
        <div className="card-body">
          <p><strong>Brand:</strong> {car.brand}</p>
          <p><strong>Model:</strong> {car.model}</p>
          {car?.type == "Rent" &&  <p><strong>Price per Hour:</strong> ₹{car.rentalPricePerHour}</p>}
          <p><strong>Description:</strong> {car.description || "No description available."}</p>
          {car?.type == "Used" &&  <p><strong>Price:</strong> ₹{car.price}</p>}


          <div className="mt-4">
            <h5>Book This Car</h5>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <form onSubmit={handleSubmit(submitBooking)}>
              <div className="mb-2">
                <label>fullName</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("fullName", { required: "fullName is required" })}
                />
                {errors.date && <p className="text-danger">{errors.fullName.message}</p>}
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

              <div className="mb-2">
                <label>Date:</label>
                <input
                  type="date"
                  className="form-control"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && <p className="text-danger">{errors.date.message}</p>}
              </div>

              <div className="mb-2">
                <label>Time:</label>
                <input
                  type="time"
                  className="form-control"
                  {...register("time", { required: "Time is required" })}
                />
                {errors.time && <p className="text-danger">{errors.time.message}</p>}
              </div>

              {car?.type == "Rent" && <div className="mb-2">
                <label>Duration (in hours):</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  {...register("duration", { required: "Duration is required", min: 1 })}
                />
                {errors.duration && <p className="text-danger">{errors.duration.message}</p>}
              </div>}


              {car?.type == "Rent" &&   <h5>Total Price: ₹{totalPrice}</h5>}

              <button type="submit" className="btn btn-primary w-100 mt-3" >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
