import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Razorpay from "razorpay";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState(0);
  const [images, setImages] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("rentalPricePerHour");
  const [periodPrice, setPeriodPrice] = useState(0);

  const requestHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const id = location.state?.id;
        const response = await axios.post("http://localhost:3030/cardetails", { id }, requestHeader);
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

  // Calculate total price and advance payment amount
  const duration = watch("duration");
  useEffect(() => {
    if (duration && car?.type === "Rent") {
      const price = periodPrice * duration;
      setTotalPrice(price);
      setAdvancePaymentAmount(price * 0.2); // 20% advance payment
    }
  }, [duration, car, periodPrice]);

  // Update period price when selected period changes
  useEffect(() => {
    if (car?.type === "Rent") {
      switch (selectedPeriod) {
        case "rentalPricePerHour":
          setPeriodPrice(car.rentalPricePerHour);
          break;
        case "rentalPricePerday":
          setPeriodPrice(car.rentalPricePerday);
          break;
        case "rentalPricePerweak":
          setPeriodPrice(car.rentalPricePerweak);
          break;
        case "rentalPricePermonth":
          setPeriodPrice(car.rentalPricePermonth);
          break;
        default:
          setPeriodPrice(0);
      }
    }
  }, [selectedPeriod, car]);

  // Handle image upload
  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages([...files]);
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
      amount: advancePaymentAmount * 100, // Amount in paise (e.g., 2000 paise = ₹20)
      currency: "INR",
      name: "Car Rental",
      description: "Advance Payment for Car Booking",
      handler: async (response) => {
        alert("Payment Successful!");
        // Save payment details to the backend
        await axios.post("http://localhost:3030/savePayment", {
          bookingId: "TEMP_BOOKING_ID", // Replace with actual booking ID
          paymentId: response.razorpay_payment_id,
          amount: advancePaymentAmount,
        }, requestHeader);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  };

  // Handle booking submission
  const submitBooking = async (data) => {
    const formData = new FormData();

    // Append car and booking details
    formData.append("car", JSON.stringify(car));
    formData.append("bookingDetails", JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      date: data.date,
      time: data.time,
      duration: data.duration,
      totalPrice: totalPrice,
      advancePayment: advancePaymentAmount,
      rentalPeriod: selectedPeriod,
    }));

    // Append uploaded images
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const response = await axios.post("http://localhost:3030/postbooking", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 201) {
        alert("Booking Confirmed!");
        navigate(`/booking-confirmation/${response.data.booking._id}`, { state: { id: response.data.booking._id } });
      } else {
        setErrorMessage("Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

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
          <p><strong>Type:</strong> {car.type === "Rent" ? "Rental Car" : "Used Car"}</p>
          {car.type === "Rent" && (
            <>
              <p><strong>Price per Hour:</strong> ₹{car.rentalPricePerHour}</p>
              <p><strong>Price per Day:</strong> ₹{car.rentalPricePerday}</p>
              <p><strong>Price per Week:</strong> ₹{car.rentalPricePerweak}</p>
              <p><strong>Price per Month:</strong> ₹{car.rentalPricePermonth}</p>
            </>
          )}
          {car.type === "Used" && <p><strong>Price:</strong> ₹{car.price}</p>}
          <p><strong>Description:</strong> {car.description || "No description available."}</p>

          <div className="mt-4">
            <h5>Book This Car</h5>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <form onSubmit={handleSubmit(submitBooking)}>
              <div className="mb-2">
                <label>Full Name</label>
                <input type="text" className="form-control" {...register("fullName", { required: "Full Name is required" })} />
                {errors.fullName && <p className="text-danger">{errors.fullName.message}</p>}
              </div>

              <div className="mb-2">
                <label>Email:</label>
                <input type="email" className="form-control" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
              </div>

              <div className="mb-2">
                <label>Phone:</label>
                <input type="number" className="form-control" {...register("phone", { required: "Phone number is required" })} />
                {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
              </div>

              <div className="mb-2">
                <label>Address:</label>
                <input type="text" className="form-control" {...register("address", { required: "Address is required" })} />
                {errors.address && <p className="text-danger">{errors.address.message}</p>}
              </div>

              <div className="mb-2">
                <label>Date:</label>
                <input type="date" className="form-control" {...register("date", { required: "Date is required" })} />
                {errors.date && <p className="text-danger">{errors.date.message}</p>}
              </div>

              <div className="mb-2">
                <label>Time:</label>
                <input type="time" className="form-control" {...register("time", { required: "Time is required" })} />
                {errors.time && <p className="text-danger">{errors.time.message}</p>}
              </div>

              {car.type === "Rent" && (
                <>
                  <div className="mb-2">
                    <label>Select Rental Period:</label>
                    <select
                      className="form-control"
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                      <option value="rentalPricePerHour">Per Hour</option>
                      <option value="rentalPricePerday">Per Day</option>
                      <option value="rentalPricePerweak">Per Week</option>
                      <option value="rentalPricePermonth">Per Month</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label>Duration:</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      {...register("duration", { required: "Duration is required", min: 1 })}
                    />
                    {errors.duration && <p className="text-danger">{errors.duration.message}</p>}
                  </div>

                  <div className="mb-2">
                    <label>Advance Payment (20%):</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`₹${advancePaymentAmount}`}
                      readOnly
                    />
                  </div>

                  <div className="mb-2">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={handlePayment}
                    >
                      Pay Now
                    </button>
                  </div>
                </>
              )}

              <div className="mb-2">
                <label>Upload Image:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  multiple // Allow multiple files
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
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