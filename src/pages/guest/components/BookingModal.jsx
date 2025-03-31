import { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
const BookingModal = ({ 
  room, 
  onClose, 
  onBookingSuccess
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Add this line
  const [bookingData, setBookingData] = useState({
    check_in: new Date(),
    check_out: new Date(Date.now() + 86400000), // Default to next day
    full_name: "",
    email: "",
    phone: "",
    room_plan: room?.type || "",
    payment_method: "card", // Default to card payment
    payment_reference: ""
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate total price when dates change
  useEffect(() => {
    if (room && bookingData.check_in && bookingData.check_out) {
      const diffTime = Math.abs(
        new Date(bookingData.check_out) - new Date(bookingData.check_in)
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalPrice(diffDays * room.price);
    }
  }, [bookingData.check_in, bookingData.check_out, room]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setBookingData(prev => ({ ...prev, [field]: date }));
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      const bookingPayload = {
        user_id: user.id,
        room_id: room.id,
        check_in: bookingData.check_in.toISOString().split('T')[0],
        check_out: bookingData.check_out.toISOString().split('T')[0],
        total_price: totalPrice,
        reservation_status: "Paid",
        room_plan: bookingData.room_plan,
        full_name: bookingData.full_name,
        email: bookingData.email,
        phone: bookingData.phone,
        payment_method: bookingData.payment_method,
        payment_reference: reference.reference
      };
  
      const response = await axios.post(
        "http://localhost:8000/createBooking.php", 
        bookingPayload
      );
      
      if (response.data?.success) {
        setBookingSuccess(true);
        
        // Close modal first
        onClose();
        
        // Then trigger navigation after modal animation completes
        setTimeout(() => {
          onBookingSuccess({
            ...response.data.booking,
            // Add any frontend-specific data
            room_number: room.room_number,
            room_type: room.type
          });
        }, 300);
      } else {
        throw new Error(response.data?.message || 'Booking failed');
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed: " + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaystackPayment = () => {
    if (!bookingData.email) {
      console.log("Please enter your email address");
      return;
    }

    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
      console.error("Paystack public key is not configured");
      console.log("Payment system is not configured properly. Please try again later.");
      return;
    }

    setProcessingPayment(true);
    
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: bookingData.email,
      amount: totalPrice * 100,
      ref: `BOOKING_${Date.now()}`,
      currency: 'NGN',
      metadata: {
        custom_fields: [
          {
            display_name: "Room Number",
            variable_name: "room_number",
            value: room?.room_number || ''
          },
          {
            display_name: "Guest Name",
            variable_name: "guest_name",
            value: bookingData.full_name
          }
        ]
      },
      callback: (response) => {
        handlePaymentSuccess(response);
      },
      onClose: () => {
        setProcessingPayment(false);
        console.log("Payment was cancelled");
      }
    });

    handler.openIframe();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bookingData.payment_method === "cash") {
      try {
        const booking = {
          user_id: user.id,
          room_id: room.id,
          check_in: bookingData.check_in.toISOString().split('T')[0],
          check_out: bookingData.check_out.toISOString().split('T')[0],
          total_price: totalPrice,
          reservation_status: "Reserved",
          room_plan: bookingData.room_plan,
          full_name: bookingData.full_name,
          email: bookingData.email,
          phone: bookingData.phone,
          payment_method: "cash",
          payment_reference: "CASH_PAYMENT_" + Date.now()
        };

        const response = await axios.post(
          "http://localhost:8000/createBooking.php", 
          booking
        );
        
        if (response.data.success) {
          setBookingSuccess(true);
          setTimeout(() => {
            onClose();
            onBookingSuccess(response.data.booking);
          }, 2000);
        } else {
          console.log("Booking failed: " + response.data.message);
        }
      } catch (err) {
        console.log("Error submitting booking: " + err.message);
      }
    } else {
      handlePaystackPayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-y-auto max-h-[90vh] animate-fade-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Book Room #{room.room_number}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Booking Successful!</h3>
              <p className="text-gray-600">Your reservation has been confirmed.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Personal Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={bookingData.full_name}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                {/* Booking Dates */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Booking Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                      <DatePicker
                        selected={bookingData.check_in}
                        onChange={(date) => handleDateChange(date, 'check_in')}
                        minDate={new Date()}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                      <DatePicker
                        selected={bookingData.check_out}
                        onChange={(date) => handleDateChange(date, 'check_out')}
                        minDate={bookingData.check_in}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Options */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Booking Options</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Plan</label>
                    <select
                      name="room_plan"
                      value={bookingData.room_plan}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value={room.type}>{room.type}</option>
                      <option value="Breakfast Included">Breakfast Included</option>
                      <option value="Half Board">Half Board</option>
                      <option value="Full Board">Full Board</option>
                    </select>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <h4 className="block text-sm font-medium text-gray-700 mb-1">Payment Method</h4>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment_method"
                          value="card"
                          checked={bookingData.payment_method === "card"}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-orange-600"
                        />
                        <span>Card/Bank Payment</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cash"
                          checked={bookingData.payment_method === "cash"}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-orange-600"
                        />
                        <span>Pay on Arrival</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Room Price:</span>
                  <span>₦{room.price}/night</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Nights:</span>
                  <span>{Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total Price:</span>
                  <span className="text-orange-600">₦{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingPayment}
                  className={`px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto shadow-md ${
                    processingPayment ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {processingPayment ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;