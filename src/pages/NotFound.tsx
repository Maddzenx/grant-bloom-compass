import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-bg">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-accent-2">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-[#7D54F4] hover:opacity-90 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
