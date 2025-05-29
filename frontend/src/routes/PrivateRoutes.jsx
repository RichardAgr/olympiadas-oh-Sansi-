// components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const rol = localStorage.getItem("rol");

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/homePrincipal/login" replace />;
  }

  // Si el rol no está en los permitidos, redirige al home
  if (!allowedRoles?.includes(rol)) {
    return <Navigate to="/homePrincipal" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;