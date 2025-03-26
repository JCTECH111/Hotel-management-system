import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import GetRooms from "../../../hook/GetRooms";

const GuestRooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'available', 'booked'
  const { roomsValue: GottenRooms, loading: roomsLoading, error: roomsError } = GetRooms();


  useEffect(() => {
    if (GottenRooms.length > 0) {
      setRooms(GottenRooms);
      console.log(GottenRooms)
    }
  }, [GottenRooms]);

  // Sample room data
  // const rooms = [
  //   {
  //     id: 1,
  //     roomNumber: "#001",
  //     bedType: "Double bed",
  //     floor: "Floor - 1",
  //     amenities: "AC, shower, Double bed, towel, bathtub, TV",
  //     status: "available",
  //   },
  //   {
  //     id: 2,
  //     roomNumber: "#002",
  //     bedType: "Single bed",
  //     floor: "Floor - 2",
  //     amenities: "AC, shower, Single bed, towel, bathtub, TV",
  //     status: "booked",
  //   },
  //   {
  //     id: 3,
  //     roomNumber: "#003",
  //     bedType: "VIP",
  //     floor: "Floor - 1",
  //     amenities: "AC, shower, VIP bed, towel, bathtub, TV",
  //     status: "available",
  //   },
  //   // Add more rooms as needed
  // ];

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
    <div className="p-1">
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
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            All rooms ({rooms.length})
          </button>
          <button
            onClick={() => setFilter("Available")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${filter === "Available" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            Available ({rooms.filter((room) => room.status === "Available").length})
          </button>
          <button
            onClick={() => setFilter("Occupied")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${filter === "Occupied" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            Occupied ({rooms.filter((room) => room.status === "Occupied").length})
          </button>
          <button
            onClick={() => setFilter("Reserved")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${filter === "Reserved" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            Reserved ({rooms.filter((room) => room.status === "Reserved").length})
          </button>
          <button
            onClick={() => setFilter("Cleaning")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${filter === "Cleaning" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            Cleaning ({rooms.filter((room) => room.status === "Cleaning").length})
          </button>
          <button
            onClick={() => setFilter("Maintenance")}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${filter === "Maintenance" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            Maintenance ({rooms.filter((room) => room.status === "Maintenance").length})
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
            <h2 className="text-xl font-semibold mb-2">{room.room_number}</h2>
            <p className="text-gray-600 mb-2">{room.bed_type}</p>
            <p className="text-gray-600 mb-4">Floor {"-"} {room.floor}</p>
            <p className="text-gray-500 text-sm mb-4 truncate">
              {room.facility_names.join(" ")}
            </p>
            <div className="flex justify-between p-2">
              <div
                className={`px-3 py-1 rounded-full text-sm w-fit ${(() => {
                  switch (room.status) {
                    case 'Available':
                      return 'bg-green-100 text-green-800';
                    case 'Occupied':
                      return 'bg-red-100 text-red-800';
                    case 'Cleaning':
                      return 'bg-yellow-100 text-yellow-800';
                    case 'Maintenance':
                      return 'bg-blue-100 text-blue-800';
                    case 'Reserved':
                      return 'bg-purple-100 text-purple-800';
                    default:
                      return 'bg-gray-100 text-gray-800'; // Fallback for unknown status
                  }
                })()}`}
              >
                {room.status}
              </div>
              <Link to={`/guest-dashboard/all-rooms/${room.id}`}>
                <EyeIcon className="text-green-800 cursor-pointer w-6 h-6" />
              </Link>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default GuestRooms;