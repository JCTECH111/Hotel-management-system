import { useEffect, useState, useContext } from "react";
import { CalendarIcon, UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GetRoomsBooking from "../../../hook/GetRoomBooking";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../context/AuthContext";
const RoomBooking = () => {
  const { user } = useContext(AuthContext);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [rooms, setRooms] = useState([]);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "",
  });
  const { roomsValue: GottenRooms, loading: roomsLoading, error: roomsError } = GetRoomsBooking();

  useEffect(() => {
    if (GottenRooms.length > 0) {
      setRooms(GottenRooms);
      console.log(GottenRooms)
    }
  }, [GottenRooms]);
  const openBookingModal = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
    setGuestInfo({ name: "", email: "", phone: "", specialRequests: "", paymentMethod: "" });
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone || !checkInDate || !checkOutDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const booking = {
      user_id: user.id,
      room_id: selectedRoom.id,
      check_in: checkInDate,
      check_out: checkOutDate,
      total_price: selectedRoom.price * ((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)),
      reservation_status: "Reserved",
      room_plan: selectedRoom.type,
      extras: guestInfo.specialRequests,
      payment_method: guestInfo.paymentMethod,
      full_name: guestInfo.name, // Use 'full_name' instead of 'guest_name'
      email: guestInfo.email,    // Use 'email' instead of 'guest_email'
      phone: guestInfo.phone,    // Use 'phone' instead of 'guest_phone'
    };

    fetch('http://localhost:8000/add_booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    })
      .then(response => response.json())
      .then(data => {
        if (data.booking_id) {
          toast.success('Booking successful! Booking ID: ' + data.booking_id);
          // Redirect or show confirmation
        } else {
          toast.error('Error: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('An error occurred. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false); // Reset loading state
        setIsBookingModalOpen(false)
      });
  };

  // const rooms = [
  //   {
  //     id: 1,
  //     name: "Deluxe Room",
  //     image: "https://th.bing.com/th/id/OIP.pMbbR4yghEce8r2rV5aIRQHaE4?pid=ImgDetMain",
  //     price: 150,
  //     amenities: "AC, Wi-Fi, TV, Breakfast",
  //     capacity: 2,
  //   },
  //   {
  //     id: 2,
  //     name: "Suite",
  //     image: "https://th.bing.com/th/id/OIP.qRJFBjNjwd6WeVwwgkcDDgHaE7?pid=ImgDetMain",
  //     price: 250,
  //     amenities: "AC, Wi-Fi, TV, Mini Bar, Breakfast",
  //     capacity: 4,
  //   },
  //   {
  //     id: 3,
  //     name: "Single Room",
  //     image: "https://th.bing.com/th/id/OIP.eL8nSM3Zv5vQJZL5EWKd4wHaFy?pid=ImgDetMain",
  //     price: 100,
  //     amenities: "AC, Wi-Fi, TV",
  //     capacity: 1,
  //   },
  // ];

  const filteredRooms = rooms.filter((room) => {
    if (roomType === "all") return room.capacity >= guests;
    return room.capacity >= guests && room.type.includes(roomType);
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for rooms...");
  };

  return (
    <div className="p-1 mb-10">
      <h1 className="text-3xl font-bold mb-6">Book a Room</h1>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Check-In</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-9 transform -translate-y-1/2" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Check-Out</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-9 transform -translate-y-1/2" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Guests</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-9 transform -translate-y-1/2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="Suite">Suite</option>
              <option value="Standard">Standard</option>
              <option value="Superior">Superior</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Villa">Villa</option>
              <option value="Ocean View">Ocean View</option>
              <option value="Pool View">Pool View</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={room.roomImage[0]}
              alt={room.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{room.type}</h2>
            <p className="text-gray-600 mb-2">${room.price} / night</p>
            <p className="text-gray-500 text-sm mb-4 truncate">{room.facility_names.join(" ")}</p>
            <button
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              onClick={() => openBookingModal(room)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {isBookingModalOpen && selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="bg-white p-6 rounded-lg z-40 shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
            <p className="text-gray-600 mb-4">
              You are booking the <strong>{selectedRoom.type}</strong> for{" "}
              <strong>${selectedRoom.price} / night</strong>.
            </p>
            <form onSubmit={handleBookingSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={guestInfo.name}
                onChange={handleGuestInfoChange}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={guestInfo.email}
                onChange={handleGuestInfoChange}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={guestInfo.phone}
                onChange={handleGuestInfoChange}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                required
              />
              <div className="sm:col-span-3 mb-3">
                <label htmlFor="payment-method" className="block text-sm/6 font-medium text-gray-900">Payment Method</label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="payment-method"
                    name="paymentMethod"
                    value={guestInfo.paymentMethod}
                    onChange={handleGuestInfoChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Pos">Pos</option>
                    <option value="Online-Payment">Online Payment</option>
                  </select>
                  <svg className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <textarea
                name="specialRequests"
                placeholder="Special Requests"
                value={guestInfo.specialRequests}
                onChange={handleGuestInfoChange}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <button
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={isSubmitting} // Disable button while submitting
              >
                {isSubmitting ? "Booking..." : "Book"}
              </button>
            </form>
            <button
              onClick={closeBookingModal}
              className="mt-4 px-5 py-2 rounded-xl bg-red-500 font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBooking;