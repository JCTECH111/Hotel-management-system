import { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  InboxStackIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-[#ECF3F3] text-white h-screen p-5 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } fixed md:relative`}
      >
        {/* Logo & Toggle Button */}
        <div className="flex justify-between items-center">
          <h2 className={`text-lg font-bold ${isOpen ? "block" : "hidden"} md:block`}>
            Hotel Admin
          </h2>
          <button
            className="md:hidden text-white"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-10">
          <ul className="space-y-4">
            <li className="flex items-center gap-4 p-3 text-gray-800 hover:text-white font-bold hover:bg-green-600 rounded cursor-pointer">
              <HomeIcon className="h-6 w-6" />
              {isOpen && <span>Dashboard</span>}
            </li>
            <li className="flex items-center gap-4 p-3 text-gray-800 hover:text-white font-bold hover:bg-green-600 rounded cursor-pointer">
              <InboxStackIcon className="h-6 w-6" />
              {isOpen && <span>Rooms</span>}
            </li>
            <li className="flex items-center gap-4 p-3 text-gray-800 hover:text-white font-bold hover:bg-green-600 rounded cursor-pointer">
              <UserIcon className="h-6 w-6" />
              {isOpen && <span>Guests</span>}
            </li>
            <li className="flex items-center gap-4 p-3 text-gray-800 hover:text-white font-bold hover:bg-green-600 rounded cursor-pointer">
              <CogIcon className="h-6 w-6" />
              {isOpen && <span>Settings</span>}
            </li>
            <li className="flex items-center gap-4 p-3 text-gray-800 hover:text-white font-bold hover:bg-red-500 rounded cursor-pointer">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              {isOpen && <span>Logout</span>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 p-6 md:ml-${isOpen ? "64" : "20"}`}>
        <button
          className="md:hidden bg-green-700 text-white p-2 rounded"
          onClick={toggleSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
