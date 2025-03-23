import { useState, useEffect } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GetGuests from "../../../hook/GetGuests";
import { Link } from "react-router-dom";
import axios from "axios";

const GuestPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [guests, setGuests] = useState([]);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [statusFilter, setStatusFilter] = useState("all");
  const { guests: gottenGuests, loading: guestsLoading, error: guestError } = GetGuests();
  const [selectedBooking, setSelectedBooking] = useState(null); // Initialize as null
  const [selectLoading, setSelectLoading] = useState(false);
  useEffect(() => {
    if (gottenGuests.length > 0) {
      // Transform the data to match the expected structure
      const transformedGuests = gottenGuests.map((guest) => ({
        id: guest.booking_id,
        name: guest.full_name,
        room_id: guest.room_id,
        roomNumber: guest.room_number,
        checkInDate: guest.check_in,
        checkOutDate: guest.check_out,
        status: guest.reservation_status,
      }));
      setGuests(transformedGuests);
    }
  }, [gottenGuests]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter guests based on search query and status
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || guest.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuests = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewBooking = async (bookingId) => {
    setSelectLoading(true); // Set loading state to true
    try {
      const response = await axios.get(`http://localhost:8000/get_booking.php`, {
        params: {
          booking_id: bookingId,
        },
      });
      const value = response.data;
      setSelectedBooking(value); // Update selected booking state
      console.log(value)
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setSelectedBooking(null); // Clear selected booking on error
    } finally {
      setSelectLoading(false); // Reset loading state
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Guest Management</h1>
      
      {/* Display Selected Booking Details */}
      {selectLoading ? (
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-700">Loading booking details...</p>
          </div>
        ) : selectedBooking ? (
          <div className="w-full mb-8 bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-8">
            <div className='md:w-1/4 w-full flex flex-col gap-4'>
              <img
                src={selectedBooking.room_images[0]}
                alt="roombooked"
                className="rounded-lg  w-full h-40 object-cover object-ceter"
              />
              <Link to={`/employee/room-details/${selectedBooking.room_details.room_id}`}>
                <button className='p-3 w-full flex items-center justify-center border-1 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white cursor-pointer'>See room details</button>
              </Link>
            </div>
            <div className="flex flex-col gap-4 p-4 ">
              {/* Guest Name and Order ID */}
              <div className="flex flex-col gap-4  pb-4">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedBooking.guest_name}</h3>
                </div>
                <div>
                  <p className="text-lg font-semibold">Order ID: #{selectedBooking.booking_id}</p>
                </div>
              </div>

              {/* Check In and Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4  pb-4">
                <div>
                  <h3 className="text-xl font-semibold">Check In</h3>
                  <p className="text-lg">
                    {new Date(selectedBooking.check_in).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Check Out</h3>
                  <p className="text-lg">
                    {new Date(selectedBooking.check_out).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Guest and Room Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                <div>
                  <h3 className="text-xl font-semibold">Guest</h3>
                  <p className="text-lg">{selectedBooking.capacity}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Room Type</h3>
                  <p className="text-lg">{selectedBooking.room_details.room_type}</p>
                </div>
              </div>

              {/* Room Plan and Room Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4  pb-4">
                <div>
                  <h3 className="text-xl font-semibold">Room Plan</h3>
                  <p className="text-lg">{selectedBooking.room_plan}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Room Number</h3>
                  <p className="text-lg">{selectedBooking.room_details.room_number}</p>
                </div>
              </div>

              {/* Total Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xl font-bold">Total</h4>
                </div>
                <div>
                  <p className="text-lg font-bold">₦{selectedBooking.total_price}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

      {/* Search Bar and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search guests by name, room number, or ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </form>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">All Statuses</option>
          <option value="Checked-In">Checked-In</option>
          <option value="Checked-Out">Checked-Out</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.checkInDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.checkOutDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                  onClick={() => handleViewBooking(guest.id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
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
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredGuests.length / itemsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredGuests.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GuestPage;