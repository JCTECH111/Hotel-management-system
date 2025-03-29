import { 
  CheckIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon, 
  ArrowDownTrayIcon, 
  PlusIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const confettiContainer = useRef(null);
  const booking = state?.booking;

  useEffect(() => {
    const container = confettiContainer.current;
    if (!container) return;

    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute rounded-full w-2 h-2';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 100}%`;
      confetti.style.opacity = '0';
      
      setTimeout(() => {
        confetti.style.transition = 'all 1s ease-out';
        confetti.style.opacity = '1';
        confetti.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * 200}px) rotate(${Math.random() * 360}deg)`;
      }, i * 20);
      
      container.appendChild(confetti);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">Please check your booking history or contact support.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center relative overflow-hidden">
        {/* Confetti container */}
        <div ref={confettiContainer} className="absolute inset-0 overflow-hidden pointer-events-none" />
        
        {/* Success icon */}
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckIcon className="h-12 w-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your reservation has been successfully completed.</p>
        
        {/* Booking details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
            <span className="font-medium">
              {formatDate(booking.check_in)} • {formatTime(booking.check_in)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
            <span className="font-medium">
              {booking.location || '123 Wellness Center, Suite 400'}
            </span>
          </div>
          <div className="flex items-center">
            <UserIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
            <span className="font-medium">
              {booking.professional || 'Dr. Sarah Johnson'} - {booking.room_type || 'Massage Therapy'}
            </span>
          </div>
        </div>
        
        {/* Confirmation number */}
        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-600">Confirmation number</p>
          <p className="font-mono font-bold text-blue-600 text-lg">
            {booking.bookingId || 'BK-2023-5X8Z9'}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
            onClick={() => {
              // Implement download receipt functionality
              console.log('Download receipt for booking:', booking.id);
            }}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download Receipt
          </button>
          <button 
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
            onClick={() => {
              // Implement add to calendar functionality
              console.log('Add to calendar:', booking);
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add to Calendar
          </button>
        </div>
        
        {/* Help section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need to make changes to your booking?</p>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center mx-auto transition-colors"
            onClick={() => navigate('/contact-support')}
          >
            <EnvelopeIcon className="w-4 h-4 mr-1" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;