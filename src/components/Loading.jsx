import React from "react";
import loadingAnimation from "../assets/loader.svg"; // Adjust the path to your SVG file

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className=" flex flex-col items-center">
        {/* SVG Animation */}
        <img
          src={loadingAnimation}
          alt="Loading..."
          className="w-24 h-24 mb-4"
        />

        {/* Loading Text */}
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;