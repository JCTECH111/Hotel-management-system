import { useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'available', 'booked'

  // Sample room data
  const rooms = [
    {
      id: 1,
      roomNumber: "#001",
      bedType: "Double bed",
      floor: "Floor - 1",
      amenities: "AC, shower, Double bed, towel, bathtub, TV",
      status: "available",
    },
    {
      id: 2,
      roomNumber: "#002",
      bedType: "Single bed",
      floor: "Floor - 2",
      amenities: "AC, shower, Single bed, towel, bathtub, TV",
      status: "booked",
    },
    {
      id: 3,
      roomNumber: "#003",
      bedType: "VIP",
      floor: "Floor - 1",
      amenities: "AC, shower, VIP bed, towel, bathtub, TV",
      status: "available",
    },
    // Add more rooms as needed
  ];

  // Filter rooms based on status
  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    return room.status === filter;
  });

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add search logic here
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Search for rooms and offers</h1>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All rooms ({rooms.length})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-lg ${
              filter === "available"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Available ({rooms.filter((room) => room.status === "available").length})
          </button>
          <button
            onClick={() => setFilter("booked")}
            className={`px-4 py-2 rounded-lg ${
              filter === "booked"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Booked ({rooms.filter((room) => room.status === "booked").length})
          </button>
        </div>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold mb-2">{room.roomNumber}</h2>
            <p className="text-gray-600 mb-2">{room.bedType}</p>
            <p className="text-gray-600 mb-4">{room.floor}</p>
            <p className="text-gray-500 text-sm mb-4">{room.amenities}</p>
            <div
              className={`px-3 py-1 rounded-full text-sm w-fit ${
                room.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {room.status === "available" ? "Available" : "Booked"}
            </div>
          </div>
        ))}
      </div>

      {/* Add Room Button */}
      <Link to='/employee/add-room'>
        <button className="fixed md:bottom-6 bottom-20 md:right-6 right-3 p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200">
        <PlusIcon className="w-6 h-6" />
      </button>
      </Link>
      
    </div>
  );
};

export default Rooms;