import {  useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  PhoneIcon,
  ClipboardDocumentCheckIcon,
  InboxStackIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../../context/AuthContext";
const GuestDashboard = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:flex-col w-64 bg-[#ECF3F3] text-green-700 p-5">
        <h2 className="text-lg font-bold mb-6">Hotel Admin</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/guest-dashboard/all-rooms"
                className="flex items-center gap-3 p-2 text-gray-800 font-bold hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <InboxStackIcon className="w-6 h-6" /> Rooms
              </Link>
            </li>
            <li>
              <Link
                to={`/guest-dashboard/booking-history/${user.email}`}
                className="flex items-center gap-3 p-2 text-gray-800 font-bold hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <ClipboardDocumentCheckIcon className="w-6 h-6" /> Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/guest-dashboard/contact"
                className="flex items-center gap-3 p-2 text-gray-800 font-bold hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <PhoneIcon className="w-6 h-6" /> Contact
              </Link>
            </li>
            <li>
              <Link
                to="/guest-dashboard/settings"
                className="flex items-center gap-3 p-2 text-gray-800 font-bold hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <CogIcon className="w-6 h-6" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar - Hidden on mobile */}
        <nav className="hidden md:flex bg-[#ECF3F3] shadow-md p-4 justify-between items-center rounded-2xl m-2 mt-3">
          <h1 className="text-xl font-bold text-green-700">Overview</h1>
          <div className="flex items-center gap-4">
            <BellIcon className="text-gray-600 cursor-pointer w-6 h-6" />
            <UserIcon className="text-gray-600 cursor-pointer w-6 h-6" />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-4">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Shows only on mobile */}
        <div className="md:hidden fixed mx-3 bottom-2 rounded-3xl left-0 right-0 bg-[#ECF3F3] border border-gray-300 shadow-xl flex justify-around items-center py-2 px-2 z-50">
          {/* Logo - Acts as home button */}
          <Link
            to="/guest-dashboard/all-rooms"
            className="flex flex-col items-center hover:bg-green-700 hover:text-white rounded-xl p-2 transition-colors"
          >
            <InboxStackIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Rooms</span>
          </Link>

          <Link
            to="/guest-dashboard/booking-history"
            className="flex flex-col items-center hover:bg-green-700 hover:text-white rounded-xl p-2 transition-colors"
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Bookings</span>
          </Link>

          <Link
            to="/guest-dashboard/contact"
            className="flex flex-col items-center hover:bg-green-700 hover:text-white rounded-xl p-2 transition-colors"
          >
            <PhoneIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Contact</span>
          </Link>

          <Link
            to="/guest-dashboard/settings"
            className="flex flex-col items-center hover:bg-green-700 hover:text-white rounded-xl p-2 transition-colors"
          >
            <CogIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;

