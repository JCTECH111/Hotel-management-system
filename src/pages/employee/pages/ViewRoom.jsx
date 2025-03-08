import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const ViewRoom = () => {
  const [showReviews, setShowReviews] = useState(false);

  const room = {
    id: 8,
    name: "Deluxe No.002",
    price: 340,
    type: "Deluxe",
    status: "Available",
    images: ["https://th.bing.com/th/id/OIP.pMbbR4yghEce8r2rV5aIRQHaE4?pid=ImgDetMain", "https://th.bing.com/th/id/OIP.qRJFBjNjwd6WeVwwgkcDDgHaE7?pid=ImgDetMain", "https://th.bing.com/th/id/OIP.eL8nSM3Zv5vQJZL5EWKd4wHaFy?pid=ImgDetMain"],
    amenities: ["Shower", "Sea View", "Refrigerator", "Internet", "King Bed"],
    reviews: [
      {
        user: "John Doe",
        rating: 5,
        comment: "Amazing stay!",
        time: "2 hours ago",
        profileImg: "https://www.gravatar.com/avatar/?d=mp",
      },
      {
        user: "Jane Smith",
        rating: 4,
        comment: "Very comfortable.",
        time: "1 day ago",
        profileImg: "https://www.gravatar.com/avatar/?d=mp",
      },
      {
        user: "Alex Brown",
        rating: 3,
        comment: "It was okay.",
        time: "3 days ago",
        profileImg: "https://www.gravatar.com/avatar/?d=mp",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-1 relative mb-14">
    {/* Edit button */}
    <div className="w-full flex justify-end  mb-4">
    <Link to={`/employee/edit-room/${room.id}`}>
        <button className="px-4 py-2 bg-orange-600 text-white rounded">Edit Room</button>
    </Link>
    </div>
      {/* Room Name and Price */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <span className="text-xl font-semibold text-green-600">${room.price}/night</span>
      </div>

      {/* Room Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {room.images.map((src, index) => (
          <img key={index} src={src} alt="Room" className="rounded-lg w-full h-32 object-cover" />
        ))}
      </div>
      {/* Room Details */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Room Details</h2>
        <p><strong>Type:</strong> {room.type}</p>
        <p><strong>Status:</strong> {room.status}</p>
      </div>

      {/* Amenities */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {room.amenities.map((amenity, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input type="checkbox" checked readOnly className="form-checkbox accent-orange-500 text-green-600 w-5 h-5" />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reviews Button (Mobile - TikTok-style popup) */}
      <button
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full md:hidden"
        onClick={() => setShowReviews(true)}
      >
        View Reviews
      </button>

      {showReviews && (
        <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-end md:hidden">
          <div className="w-full z-20 bg-white p-4 rounded-t-lg h-1/2 overflow-y-auto">
            <button
              className="text-red-500 text-right w-full"
              onClick={() => setShowReviews(false)}
            >
              Close
            </button>
            <h2 className="text-lg font-semibold mb-2">Reviews</h2>
            {room.reviews.map((review, index) => (
              <div key={index} className="border-b pb-3 mb-3 flex space-x-3">
                <img src={review.profileImg} alt="Profile" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{review.user}</p>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">{review.time}</p>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section (Desktop - Fixed under room info like social media) */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md hidden md:block">
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        {room.reviews.map((review, index) => (
          <div key={index} className="border-b pb-3 mb-3 flex space-x-3">
            <img src={review.profileImg} alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{review.user}</p>
              <div className="flex items-center">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-500 text-sm">{review.time}</p>
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRoom;
