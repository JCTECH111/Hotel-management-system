import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  Bars3BottomRightIcon,
  ArrowLeftEndOnRectangleIcon,
  CogIcon,
  InboxStackIcon,
  BellIcon,
  ChatBubbleBottomCenterIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bg-[#ECF3F3] text-green-700 w-64 h-full p-5 transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-64`}
      >
        <h2 className="text-lg font-bold mb-6">Hotel Admin</h2>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/employee"
                className="flex items-center gap-3 p-2 hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <HomeIcon className="w-6 h-6" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/employee/rooms"
                className="flex items-center gap-3 p-2 hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <InboxStackIcon className="w-6 h-6" /> Rooms
              </Link>
            </li>
            <li>
              <Link
                to="/employee/bookings"
                className="flex items-center gap-3 p-2 hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <ClipboardDocumentCheckIcon className="w-6 h-6" /> Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/employee/guests"
                className="flex items-center gap-3 p-2 hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <UserIcon className="w-6 h-6" /> Guests
              </Link>
            </li>
            <li>
              <Link
                to="/employee/messages"
                className="flex items-center gap-3 p-2 hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <ChatBubbleBottomCenterIcon className="w-6 h-6" /> Messages
              </Link>
            </li>
            <li>
              <Link
                to="/employee/settings"
                className="flex items-center gap-3 p-2 hover:bg-green-600 hover:text-white rounded cursor-pointer"
              >
                <CogIcon className="w-6 h-6" /> Settings
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="flex items-center gap-3 p-2 hover:bg-red-500 hover:text-white rounded cursor-pointer relative top-40"
              >
                <ArrowLeftEndOnRectangleIcon className="w-6 h-6" /> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:col-span-4 col-span-5 h-screen  ">
        {/* Navbar */}
        <nav className="bg-[#ECF3F3] shadow-md p-4 flex justify-between items-center">
          {/* Left Side */}
          <h1 className="text-xl font-bold text-green-700">Overview</h1>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <BellIcon className="text-gray-600 cursor-pointer w-6 h-6" />

            {/* User Profile */}
            <UserIcon className="text-gray-600 cursor-pointer w-6 h-6" />
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="p-6 h-full  overflow-y-scroll">
          <Outlet />
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 p-3 bg-green-700 text-white rounded-full shadow-lg"
      >
        <Bars3BottomRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;