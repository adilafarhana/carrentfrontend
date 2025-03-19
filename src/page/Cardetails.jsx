import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Navrent from "./Nav/Navrent";

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
  const [bookingId, setBookingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const requestHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Fetch car details on component mount
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const id = location.state?.id;
        const response = await axios.post("https://carrentbackend-1-tpmm.onrender.com/cardetails", { id }, requestHeader);
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

  // Calculate total price and advance payment based on duration
  const duration = watch("duration");
  useEffect(() => {
    if (duration && car?.type === "Rent") {
      const price = periodPrice * duration;
      setTotalPrice(price);
      setAdvancePaymentAmount(price * 0.2); // 20% advance payment
    }
  }, [duration, car, periodPrice]);

  // Set the price based on the selected rental period
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

  // Handle payment submission
  const handlePayment = async () => {
    if (!bookingId) {
      alert("payment is successfull");
      return;
    }
  
    try {
      const paymentId = uuidv4(); // Generate a unique payment ID
      const paymentData = {
        bookingId,
        paymentId,
        amount: advancePaymentAmount,
      };
  
      console.log("Payment Data:", paymentData); // Debugging
  
      const response = await axios.post(
        "https://carrentbackend-1-tpmm.onrender.com/savePayment",
        paymentData,
        requestHeader
      );
  
      if (response.status === 201) {
        alert("Payment saved successfully!");
      } else {
        alert("Failed to save payment details.");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment details.");
    }
  };

  // Handle booking submission
  const submitBooking = async (data) => {
    const formData = new FormData();
  
    // Ensure paymentMethod is set correctly
    const paymentMethodValue = paymentMethod || "Cash on Delivery"; // Default to "Cash on Delivery" if not set
  
    // Calculate totalPrice for used cars
    const totalPriceValue = car.type === "Rent" ? totalPrice : car.price;
  
    formData.append("car", JSON.stringify(car));
    formData.append("bookingDetails", JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      place: data.place,
      dob: data.dob,
      address: data.address,
      pincode:data.pincode,
      date: data.date,
      time: data.time,
      ...(car.type === "Rent" && { duration: data.duration }), // Include duration only for rental cars
      totalPrice: totalPriceValue, // Include totalPrice for both rental and used cars
      ...(car.type === "Rent" && { advancePayment: advancePaymentAmount }), // Include advancePayment only for rental cars
      paymentMethod: paymentMethodValue, // Use the correct payment method
      rentalPeriod: selectedPeriod,
    }));
  
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  
    try {
      const response = await axios.post("https://carrentbackend-1-tpmm.onrender.com/postbooking", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 201) {
        alert("Booking Confirmed!");
        setBookingId(response.data.booking._id); // Save the booking ID for payment
        console.log("Booking ID:", response.data.booking._id); // Debugging
        navigate(`/booking-confirmation/${response.data.booking._id}`, { state: { id: response.data.booking._id } });
      } else {
        setErrorMessage("Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  }; 

  if (!car) return <p className="text-center">Car details not available.</p>;

  return (
    
    <div className="container mt-5">
      <Navrent/>
      <h2 className="text-center" style={{ color: "#4a90e2", fontWeight: "bold" }}>{car.brand} {car.model}</h2>

      <div className="card mx-auto text-center shadow p-3" style={{ maxWidth: "800px", border: "2px solid #ccc" }}>
        {car.images?.length > 0 && (
          <img src={`https://carrentbackend-1-tpmm.onrender.co${car.images[0]}`} alt={car.model} className="card-img-top" style={{ maxHeight: "400px", objectFit: "cover" }} />
        )}
        <div className="card-body">
          
          <p><strong>Brand:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.brand}</span></p>
          <p><strong>Model:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.model}</span></p>
          <p><strong>Type:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.type === "Rent" ? "Rental Car" : "Used Car"}</span></p>
          <p><strong>Mileage:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.mileage} km</span></p>
          <p><strong>Fuel Type:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.fuelType}</span></p>
          <p><strong>Transmission:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.transmission}</span></p>
          <p><strong>Seating Capacity:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.seatingCapacity}</span></p>
          <p><strong>Year:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.year}</span></p>
          <p><strong>Color:</strong> <span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.color}</span></p>
          {car.type === "Rent" && (
            <>
              <p><strong>Price per Hour:</strong> ₹<span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.rentalPricePerHour}</span></p>
              <p><strong>Price per Day:</strong> ₹<span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.rentalPricePerday}</span></p>
              <p><strong>Price per Week:</strong> ₹<span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.rentalPricePerweak}</span></p>
              <p><strong>Price per Month:</strong> ₹<span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.rentalPricePermonth}</span></p>
            </>
          )}
          {car.type === "Used" && <p><strong>Price:</strong> ₹<span style={{ color: "#f36f6f", fontSize: "18px" }}>{car.price}</span></p>}
          <p><strong>Description:</strong> <span style={{ fontStyle: "italic", color: "#555" }}>{car.description || "No description available."}</span></p>

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
                <label>Place:</label>
                <input type="text" className="form-control" {...register("place", { required: "Place is required" })} />
                {errors.place && <p className="text-danger">{errors.place.message}</p>}
              </div>
              <div className="mb-2">
                <label>Date of Birth:</label>
                <input type="date" className="form-control" {...register("dob", { required: "Date of Birth is required" })} />
                {errors.dob && <p className="text-danger">{errors.dob.message}</p>}
              </div>

              <div className="mb-2">
                <label>Address:</label>
                <input type="text" className="form-control" {...register("address", { required: "Address is required" })} placeholder="Please enter permanent address" />
                {errors.address && <p className="text-danger">{errors.address.message}</p>}
              </div>
              <div className="mb-2">
                <label>pincode:</label>
                <input type="text" className="form-control" {...register("pincode", { required: "pincode is required" })} placeholder="Please enter permanent address" />
                {errors.pincode && <p className="text-danger">{errors.pincode.message}</p>}
              </div>
              {car.type === "Used" && (
                <div className="mb-2">
                  <label>Payment Method:</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Online Payment">Online Payment</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              )}
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
                <label>Upload License:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  multiple
                  placeholder="Original license"
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