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


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route element={<AdminRoute />}>
            <Route path="/car-details/:id" element={<Cardetails />} />
            <Route path="/admincardetails" element={<Admincardetails />} />
            <Route path="/admin" element={<Admindashboard />} />
            <Route path="/uploadcar" element={<Admincarupload />} />
          </Route>

          <Route element={<UserRoute />}>
            <Route path="/rendcardashboard" element={<Rendcardashboard />} />
          </Route>

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

          {/* <Route path="/blogdetails" element={<Blgdetails />} /> */}
          {/* <Route path="/viewrentblog" element={<Viewrentblog />} /> */}
          {/* <Route path="/searchcars" element={<SearchCars />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
