import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cardetails from './page/Cardetails'
// import Blogdetails from './page/blogs/Blogdetails'
import Signin from './page/Auth/Signin'
import Signup from './page/Auth/Signup'
import Admincarupload from './page/uploadrentcars/Admincarupload'
import Rendcardashboard from './page/Dashboards/Rendcardashboard'
// import Userrentblogs from './page/blogs/Userrentblogs'
import Admindashboard from './page/uploadrentcars/Admindashboard'
import Admincardetails from './page/uploadrentcars/Admincardetails'
import Dashboard from './page/Dashboards/Dashboard'
import AdminRoute from './utils/AdminRoute'
import UserRoute from './utils/UserRoute'
import UserDetails from './page/Auth/Userdetails'
import Viewusers from './page/Auth/Viewusers'
import BlogUpload from './page/blogs/BlogUpload'
import BlogList from './page/blogs/BlogList'
import Usedcardashboard from './page/Usedcar.jsx/Usedcardashboard'
import Maindashboard from './page/Dashboards/Maindashboard'
import Bookingconfirmation from './page/Bookingconfirmation'
import Adminbookingdetails from './page/Adminbookingdetails'
import Carreviews from './page/rentcaruser/Carreviews'
import Usedcarbooking from './page/Usedcar.jsx/Usedcarbooking'
import Orderstatus from './page/Orderstatus'
import ViewReview from './page/Review/ViewReview'
import Usedcarblog from './page/Usedcarblog'
import RentalPricing from './page/RentalPricing'
import Notification from './page/Notification'
import Predict from './page/Predict'
import FAQSection from './page/FAQSection'
import AdminFAQ from './page/AdminFAQ'
import Complaint from './page/Compliant'
import Admincomplaints from './page/Admincomplaints'
import Usercomplaint from './page/Usercomplaint'
import Aboutas from './page/Aboutas'
import Contact from './page/Contact'
import UploadCars from './page/Uploadcars'
import CarBookingDetailsPage from './page/CarBookingDetailsPage'
import UploadedCars from './page/UploadedCars'
import UserRentalStatus from './page/UserRentalStatus'
import ReturnCar from './page/ReternCar'
import UserReturnDetails from './page/UserReturnDetails'
import CarBookingHistory from './page/CarBookingHistory'
import BookingDetailsView from './page/BookingDeatilsView'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route element={<AdminRoute />}>
            <Route path="/car-details/:id" element={<Cardetails />} />
            <Route path="/admincardetails" element={<Admincardetails />} />
            <Route path="/uploadcar" element={<Admincarupload />} />
          </Route>

          <Route element={<UserRoute />}>
            <Route path="/rendcardashboard" element={<Rendcardashboard />} />
          </Route>
          <Route path="/admin" element={<Admindashboard />} />


          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/userdetails" element={<UserDetails />} />
          <Route path="/viewusers" element={<Viewusers />} />
          <Route path="/blogupload" element={<BlogUpload />} />
          <Route path="/bloglist" element={<BlogList />} />
          <Route path="/usedcardashboard" element={<Usedcardashboard />} />
          <Route path="/maindashboard" element={<Maindashboard/>} />
          <Route path="/booking-confirmation/:id" element={<Bookingconfirmation/>} />
          <Route path="/Adminbookingdetails" element={<Adminbookingdetails/>} />
          <Route path="/Usedcarbooking" element={<Usedcarbooking/>} />
          <Route path="/reviews/:id" element={<Carreviews/>} />
          <Route path="/Orderstatus" element={<Orderstatus/>} />
          <Route path="/car-reviews/:carId" element={<ViewReview/>} />
          <Route path="/Usedcarblog" element={<Usedcarblog/>} />
          <Route path="/RentalPricing" element={<RentalPricing/>} />
          <Route path="/Notification" element={<Notification/>} />
          <Route path="/Predict" element={<Predict/>} />
          <Route path="/FAQSection" element={<FAQSection/>} />
          <Route path="/AdminFAQ" element={<AdminFAQ/>} />
          <Route path="/Complaint" element={<Complaint/>} />
          <Route path="/Admincomplaints" element={<Admincomplaints/>} />
          <Route path="/user/complaint" element={<Usercomplaint/>} />
          <Route path="/Aboutas" element={<Aboutas/>} />
          <Route path="/Contact" element={<Contact/>} />
          <Route path="/UploadCars" element={<UploadCars/>} />
          <Route path="/CarBookingDetailsPage" element={<CarBookingDetailsPage/>} />
          <Route path="/admin/uploaded-cars" element={<UploadedCars/>} />
          <Route path="/UserRentalStatus" element={<UserRentalStatus/>} />
          <Route path="/ReturnCar" element={<ReturnCar/>} />
          <Route path="/returns/:id" element={<UserReturnDetails/>} />
          <Route path="/car-booking-history/:carId" element={<CarBookingHistory/>} />
          <Route path="/admin/booking-details/:id" element={<BookingDetailsView/>} />

          {/* <Route path="/blogdetails" element={<Blgdetails />} /> */}
          {/* <Route path="/viewrentblog" element={<Viewrentblog />} /> */}
          {/* <Route path="/searchcars" element={<SearchCars />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
