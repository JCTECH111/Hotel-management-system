import { useState } from "react";

import {
    HomeIcon,
    UserIcon,
    Bars3BottomRightIcon,
    ArrowLeftEndOnRectangleIcon,
    CogIcon,
    InboxStackIcon
  } from '@heroicons/react/24/outline';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`bg-[#ECF3F3] text-white w-64 min-h-screen p-5 transition-all duration-300 ${isOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-lg  font-bold mb-6">Hotel Admin</h2>

        <nav>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
              <HomeIcon /> Dashboard
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
              <InboxStackIcon /> Rooms
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
              <UserIcon /> Guests
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-green-600 rounded cursor-pointer">
              <CogIcon /> Settings
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-red-500 rounded cursor-pointer">
              <ArrowLeftEndOnRectangleIcon /> Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button onClick={toggleSidebar} className="md:hidden p-3 text-green-700">
        <Bars3BottomRightIcon size={24} />
      </button>
    </div>
  );
};

export default Sidebar;
