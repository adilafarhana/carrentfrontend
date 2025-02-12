import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import Signin from './page/Signin'
import Signup from './page/Signup'
import Home from './page/Home'
import Buycars from './page/Buycar'
import Cardetails from './page/Cardetails'
import Sellcar from './page/Sellcar'
import Dashboard from './page/Dashboard'
import Admincarupload from './page/Admincarupload'
import Rendcardashboard from './page/Rendcardashboard'
import Userrentblogs from './page/Userrentblogs'
import Blogdetails from './page/blogs/Blogdetails'
import Admincardetails from './page/Admincardetails'
import Cars from './page/Cars'
import Viewrentblog from './page/Viewrentblogs'
import Admindashboard from './page/Admindashboard'
// import SearchCars from './page/SearchCars'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/buycars" element={<Buycars />} />
          <Route path="/cardetails" element={<Cardetails />} />
          <Route path="/sellcar" element={<Sellcar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/uploadcar" element={<Admincarupload />} />
          <Route path="/rendcardashboard" element={<Rendcardashboard />} />
          <Route path="/Userrentblogs" element={<Userrentblogs />} />
          <Route path="/blogdetails" element={<Blogdetails />} />
          <Route path="/admincardetails" element={<Admincardetails />} />
          <Route path="/viewrentblog" element={<Viewrentblog />} />
          <Route path="/car" element={<Cars />} />
          <Route path="/admin" element={<Admindashboard />} />
          {/* <Route path="/searchcars" element={<SearchCars />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
