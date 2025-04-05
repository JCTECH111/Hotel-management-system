import { BarsArrowUpIcon, MagnifyingGlassIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import GetBookedRoom from '../../../hook/GetBookedRoom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ManagerBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null); // Initialize as null
  const [selectLoading, setSelectLoading] = useState(false);
  const { bookedRoom: GottenBookedItems, loading: roomsLoading, error: roomsError } = GetBookedRoom();

  const [searchInput, setSearchInput] = useState('');

  // Filter bookings based on search input
  const filteredBookings = GottenBookedItems.filter((booking) =>
    booking.booking_id.toLowerCase().includes(searchInput.toLowerCase()) ||
    booking.full_name.toLowerCase().includes(searchInput.toLowerCase()) ||
    booking.room_plan.toLowerCase().includes(searchInput.toLowerCase())
  );

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
    <div>
      <div className="p-4 bg-white rounded-lg shadow-md mb-14">
        <h3 className="mb-4 text-lg font-semibold">Booking Activities</h3>

        {/* Display Selected Booking Details */}
        {selectLoading ? (
          <div className="flex items-center justify-center h-16">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-700">Loading booking details...</p>
          </div>
        ) : selectedBooking ? (
          <div className="flex flex-col w-full gap-8 p-6 mb-8 rounded-lg shadow-sm bg-gray-50 md:flex-row">
            <div className='flex flex-col w-full gap-4 md:w-1/4'>
              <img
                src={selectedBooking.room_images[0]}
                alt="roombooked"
                className="object-cover w-full h-40 rounded-lg object-ceter"
              />
              <Link to={`/employee/room-details/${selectedBooking.room_details.room_id}`}>
                <button className='flex items-center justify-center w-full p-3 border-orange-500 cursor-pointer border-1 rounded-xl hover:bg-orange-500 hover:text-white'>See room details</button>
              </Link>
            </div>
            <div className="flex flex-col gap-4 p-4 ">
              {/* Guest Name and Order ID */}
              <div className="flex flex-col gap-4 pb-4">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedBooking.guest_name}</h3>
                </div>
                <div>
                  <p className="text-lg font-semibold">Order ID: #{selectedBooking.booking_id}</p>
                </div>
              </div>

              {/* Check In and Check Out */}
              <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        {/* Create New Booking Button */}
        <div className="flex justify-end w-full mb-4">
          <Link to="/employee/room-booking" className="flex items-center justify-center gap-2 px-4 py-2 font-bold text-white bg-green-600 cursor-pointer whitespace-nowrap rounded-xl">
            <PlusIcon className="w-5 h-5" />
            <button className="text-white rounded cursor-pointer">Create new booking</button>
          </Link>
        </div>

        {/* Search and Sort Section */}
        <div className="p-2">
          <form className="flex flex-col items-center w-full gap-4 md:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by room number, guest name, or room plan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="md:w-full w-[20rem] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            </div>

            {/* Sort Button */}
            <button
              type="button"
              className="flex relative md:left-0 left-[40%] items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:text-gray-700 border-b-3 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <BarsArrowUpIcon className="w-5 h-5" />
              <span className="">Sort</span>
            </button>
          </form>
        </div>

        {/* Responsive Scroll Wrapper */}
        <div className="overflow-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="p-3 whitespace-nowrap">Book ID</th>
                <th className="p-3 whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Room</th>
                <th className="p-3 whitespace-nowrap">Check-in</th>
                <th className="p-3 whitespace-nowrap">Check-out</th>
                <th className="p-3 whitespace-nowrap">Guest</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {roomsLoading ? (
                <tr>
                  <td colSpan="8">
                    <div className="flex items-center justify-center h-64">
                      <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                      <p className="ml-4 text-gray-700">Loading bookings...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="flex items-center justify-center h-64">
                      <p className="text-lg text-gray-700">No matching bookings found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const checkInDate = new Date(booking.check_in).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  const checkOutDate = new Date(booking.check_out).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={booking.booking_id} className="transition border-t border-gray-100 bg-gray-50 hover:bg-gray-100">
                      <td className="p-3 whitespace-nowrap">{booking.booking_id}</td>
                      <td className="p-3 whitespace-nowrap">{booking.full_name}</td>
                      <td className="p-3 whitespace-nowrap">{booking.room_plan}</td>
                      <td className="p-3 whitespace-nowrap">{checkInDate}</td>
                      <td className="p-3 whitespace-nowrap">{checkOutDate}</td>
                      <td className="p-3 whitespace-nowrap">1 Person</td>
                      <td className="p-3 font-semibold text-blue-500 whitespace-nowrap">{booking.reservation_status}</td>
                      <td className="p-3 font-semibold text-gray-700 whitespace-nowrap">
                        <button onClick={() => handleViewBooking(booking.booking_id)}>
                          <EyeIcon className="h-6 cursor-pointer w-7" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagerBookings;