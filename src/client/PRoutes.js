import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App";

const PRoutes = (props) => {

  const { user } = useContext(UserContext);
  const location = useLocation()
  const a = !user ? <Navigate to="/" replace state={{from: location}}/> : <Outlet/>
  return a
};

export default PRoutes;