import {  useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  InboxStackIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../../context/AuthContext";

const HkDashboard = () => {
    return (
        <div className="flex flex-col min-h-screen md:flex-row">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:flex-col w-64 bg-[#ECF3F3] text-green-700 p-5">
        <h2 className="mb-6 text-lg font-bold">Hotel Admin</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/manager-dashboard/rooms"
                className="flex items-center gap-3 p-2 font-bold text-gray-800 rounded cursor-pointer hover:bg-green-600 hover:text-white"
              >
                <InboxStackIcon className="w-6 h-6" /> Rooms
              </Link>
            </li>
            <li>
              <Link
                to="/manager-dashboard/bookings"
                className="flex items-center gap-3 p-2 font-bold text-gray-800 rounded cursor-pointer hover:bg-green-600 hover:text-white"
              >
                <ClipboardDocumentCheckIcon className="w-6 h-6" /> Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/manager-dashboard/staffs"
                className="flex items-center gap-3 p-2 font-bold text-gray-800 rounded cursor-pointer hover:bg-green-600 hover:text-white"
              >
                <UserGroupIcon className="w-6 h-6" /> Staffs
              </Link>
            </li>
            <li>
              <Link
                to="/manager-dashboard/settings"
                className="flex items-center gap-3 p-2 font-bold text-gray-800 rounded cursor-pointer hover:bg-green-600 hover:text-white"
              >
                <CogIcon className="w-6 h-6" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar - Hidden on mobile */}
        <nav className="hidden md:flex bg-[#ECF3F3] shadow-md p-4 justify-between items-center rounded-2xl m-2 mt-3">
          <h1 className="text-xl font-bold text-green-700">Overview</h1>
          <div className="flex items-center gap-4">
            <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
            <UserIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-20 overflow-y-auto md:p-6 md:pb-4">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Shows only on mobile */}
        <div className="md:hidden fixed mx-3 bottom-2 rounded-3xl left-0 right-0 bg-[#ECF3F3] border border-gray-300 shadow-xl flex justify-around items-center py-2 px-2 z-50">
          {/* Logo - Acts as home button */}
          <Link
            to="/manager-dashboard/rooms"
            className="flex flex-col items-center p-2 transition-colors hover:bg-green-700 hover:text-white rounded-xl"
          >
            <InboxStackIcon className="w-6 h-6" />
            <span className="mt-1 text-xs font-medium">Rooms</span>
          </Link>

          <Link
            to="/manager-dashboard/bookings"
            className="flex flex-col items-center p-2 transition-colors hover:bg-green-700 hover:text-white rounded-xl"
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            <span className="mt-1 text-xs font-medium">Bookings</span>
          </Link>

          <Link
            to="/manager-dashboard/staffs"
            className="flex flex-col items-center p-2 transition-colors hover:bg-green-700 hover:text-white rounded-xl"
          >
            <UserGroupIcon className="w-6 h-6" />
            <span className="mt-1 text-xs font-medium">Staffs</span>
          </Link>

          <Link
            to="/manager-dashboard/settings"
            className="flex flex-col items-center p-2 transition-colors hover:bg-green-700 hover:text-white rounded-xl"
          >
            <CogIcon className="w-6 h-6" />
            <span className="mt-1 text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
    )
}

export default HkDashboard;