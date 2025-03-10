import { useState } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const guests = [
  { id: "#5644", name: "Alexander", roomNumber: "A647", totalAmount: "$467", amountPaid: "$200", status: "Slam" },
  { id: "#6112", name: "Pegasus", roomNumber: "A459", totalAmount: "$645", amountPaid: "$250", status: "Dry" },
  { id: "#6141", name: "Martin", roomNumber: "A645", totalAmount: "$686", amountPaid: "$400", status: "Dry" },
  { id: "#6535", name: "Cecil", roomNumber: "A684", totalAmount: "$8413", amountPaid: "$2500", status: "Injected" },
  { id: "#6541", name: "Luke", roomNumber: "B464", totalAmount: "$841", amountPaid: "$400", status: "Slam" },
  { id: "#9846", name: "Yacrin", roomNumber: "C648", totalAmount: "$684", amountPaid: "$300", status: "Slam" },
  { id: "#4921", name: "Kland", roomNumber: "D644", totalAmount: "$984", amountPaid: "$513", status: "Rick up" },
  { id: "#9841", name: "Turen", roomNumber: "B641", totalAmount: "$984", amountPaid: "$600", status: "Dry" },
];

const GuestPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (guestId) => {
    console.log("Viewing details for guest:", guestId);
    // Add logic to view guest/room details
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add search logic here
  };

  // Filter guests based on search query
  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Guest Management</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.amountPaid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleViewDetails(guest.id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Previous
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Next
        </button>
      </div>
    </div>
  );
};

export default GuestPage;