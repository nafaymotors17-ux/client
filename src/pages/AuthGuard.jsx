// components/Auth/AuthGuard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setUser, clearUser } from "../redux/features/authSlice";

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("userData");

        if (!userData) {
          // No token or user data found
          dispatch(clearUser());
          if (location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
          setIsChecking(false);
          return;
        }

        // Parse user data
        const parsedUser = JSON.parse(userData);

        dispatch(setUser(parsedUser));

        // If user is already on a valid route for their role, don't redirect
        const isOnLoginRoute = location.pathname === "/login";
        if (isOnLoginRoute) {
          // If already logged in and trying to access login page, redirect to appropriate dashboard
          navigate("/admin/dashboard", {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear invalid data

        localStorage.removeItem("userData");
        dispatch(clearUser());
        navigate("/login", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, navigate, location.pathname]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user but not on login page, this will be handled by the useEffect
  if (!user && location.pathname !== "/login") {
    return null;
  }

  return children;
};

export default AuthGuard;
