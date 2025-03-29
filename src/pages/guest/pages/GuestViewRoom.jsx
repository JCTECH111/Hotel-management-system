import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BookingModal from "../components/BookingModal";
import ReviewItem from "../components/ReviewItem";

const GuestViewRoom = () => {
    const [showReviews, setShowReviews] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/viewRoom.php?roomId=${id}`);
                setRoom(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    const handleBookingSuccess = (bookingData) => {
        console.log('Booking success data:', bookingData); // Debug
        
        if (!bookingData) {
          console.error('No booking data received');
          return;
        }
      
        // Ensure you have required fields
        const completeBooking = {
          ...bookingData,
          bookingId: bookingData.id,
          date: bookingData.check_in, // or format as needed
          time: bookingData.check_in, // or calculate from check_in
          location: `Room ${bookingData.room_number} (Floor ${bookingData.floor_number})`,
          professional: bookingData.guest_name, // or appropriate value
          confirmationNumber: bookingData.booking_id || `BK-${Date.now().toString(36).toUpperCase()}`
        };
      
        navigate('/guest-dashboard/booking-success', { 
          state: { booking: completeBooking },
          replace: true // Prevent going back to modal
        });
      };

    if (loading) return <div className="text-center py-8">Loading room details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 relative mb-14">
            {/* Book Room button */}
            <div className="w-full flex justify-end mb-6">
                <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                >
                    Book Room
                </button>
            </div>

            {/* Room Name and Price */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">{room.room_number}</h1>
                <span className="text-2xl font-semibold text-green-600">${room.price}/night</span>
            </div>

            {/* Room Images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {room.image_url.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Room ${index + 1}`}
                        className="rounded-lg w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-300"
                    />
                ))}
            </div>

            {/* Room Details */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Room Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p><span className="font-medium">Type:</span> {room.type}</p>
                    <p><span className="font-medium">Status:</span> <span className={`${room.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{room.status}</span></p>
                    <p><span className="font-medium">Capacity:</span> {room.capacity} {room.capacity > 1 ? 'guests' : 'guest'}</p>
                    <p><span className="font-medium">Bed Type:</span> {room.bed_type}</p>
                </div>
            </div>

            {/* Amenities */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.facility_names.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
                    <button
                        className="md:hidden px-4 py-2 bg-green-600 text-white rounded-full"
                        onClick={() => setShowReviews(true)}
                    >
                        View All
                    </button>
                </div>

                {room.review_details.length > 0 ? (
                    <>
                        {/* Mobile Reviews Popup */}
                        {showReviews && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end md:hidden">
                                <div className="w-full bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">All Reviews</h3>
                                        <button
                                            onClick={() => setShowReviews(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {room.review_details.map((review, index) => (
                                        <ReviewItem key={index} review={review} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Desktop Reviews */}
                        <div className="hidden md:block">
                            {room.review_details.slice(0, 3).map((review, index) => (
                                <ReviewItem key={index} review={review} />
                            ))}
                            {room.review_details.length > 3 && (
                                <button
                                    onClick={() => setShowReviews(true)}
                                    className="mt-4 text-orange-600 hover:text-orange-700"
                                >
                                    View all {room.review_details.length} reviews
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">No reviews available yet.</p>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingModal && room && (
                <BookingModal
                    room={room}
                    onClose={() => setShowBookingModal(false)}
                    onBookingSuccess={handleBookingSuccess}
                    navigate={navigate}
                />
            )}

        </div>
    );
};



export default GuestViewRoom;