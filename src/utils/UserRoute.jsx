import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const token = localStorage.getItem("token");
  const isApproved = token
  return isApproved ? <Outlet /> : <Navigate to="/signin" />;
};

export default UserRoute;