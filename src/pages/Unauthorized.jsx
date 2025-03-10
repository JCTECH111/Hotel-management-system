import React from "react";
import { Link } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Icon */}
      <LockClosedIcon className="w-20 h-20 text-red-500 mb-6" />

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">403 - Unauthorized Access</h1>

      {/* Message */}
      <p className="text-lg text-gray-600 text-center mb-6">
        You do not have permission to access this page. Please contact the administrator if you believe this is an error.
      </p>

      {/* Button to Go Back */}
      <Link
        to="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;