import { BarsArrowUpIcon, MagnifyingGlassIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import GetBookedRoom from '../../../hook/GetBookedRoom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Bookings() {
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
      <div className="bg-white p-4 rounded-lg shadow-md mb-14">
        <h3 className="text-lg font-semibold mb-4">Booking Activities</h3>

        {/* Display Selected Booking Details */}
        {selectLoading ? (
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-700">Loading booking details...</p>
          </div>
        ) : selectedBooking ? (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-4">
          <img
          src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.7ITF2gx8_a3s4NbnDOpZzAHaHa%26pid%3DApi&sp=1742663222T92eaef0c3425c0a2e6fc58d5c01b716e8bcc10e947cccab93961bf387b8d5d7a"
          alt="roombooked"
          className="rounded-lg md:w-1/4 w-full h-40 object-cover object-ceter"
        />
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-semibold"> {selectedBooking.guest_name}</h3>
                <p className="text-lg font-semibold mt-2">Order ID: #{selectedBooking.booking_id}</p>
              </div>
              <div className='flex flex-col md:flex-row gap-12 justify-content-center items-center'>
                <div>
                  <h3 className="text-xl font-semibold">Check In</h3>
                  <p className='text-lg'>{new Date(selectedBooking.check_in).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Check Out</h3>
                  <p>{new Date(selectedBooking.check_out).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}</p>
                </div>
              </div>
              <div>
                <p><strong>Room Plan:</strong> {selectedBooking.room_plan}</p>
                <p><strong>Room Number:</strong> {selectedBooking.room_number}</p>
              </div>
              <div>
                <p><strong>Status:</strong> {selectedBooking.reservation_status}</p>
              </div>
              <div>
                <p><strong>Extras:</strong></p>
                <ul>
                  {selectedBooking.extras && <li>{selectedBooking.extras}</li>}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {/* Create New Booking Button */}
        <div className="w-full flex justify-end mb-4">
          <Link to="/employee/room-booking" className="flex justify-center items-center gap-2 px-4 py-2 cursor-pointer bg-green-600 font-bold text-white whitespace-nowrap rounded-xl">
            <PlusIcon className="w-5 h-5" />
            <button className="cursor-pointer text-white rounded">Create new booking</button>
          </Link>
        </div>

        {/* Search and Sort Section */}
        <div className="p-2">
          <form className="flex items-center md:flex-row flex-col gap-4 w-full">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by room number, guest name, or room plan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="md:w-full w-[20rem] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
              <tr className="bg-gray-200 text-left">
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
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      <p className="ml-4 text-gray-700">Loading bookings...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-700 text-lg">No matching bookings found.</p>
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
                    <tr key={booking.booking_id} className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                      <td className="p-3 whitespace-nowrap">{booking.booking_id}</td>
                      <td className="p-3 whitespace-nowrap">{booking.full_name}</td>
                      <td className="p-3 whitespace-nowrap">{booking.room_plan}</td>
                      <td className="p-3 whitespace-nowrap">{checkInDate}</td>
                      <td className="p-3 whitespace-nowrap">{checkOutDate}</td>
                      <td className="p-3 whitespace-nowrap">1 Person</td>
                      <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">{booking.reservation_status}</td>
                      <td className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                        <button onClick={() => handleViewBooking(booking.booking_id)}>
                          <EyeIcon className="w-7 h-6 cursor-pointer" />
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

export default Bookings;