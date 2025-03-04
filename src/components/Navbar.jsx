
import {
    UserIcon,
    BellIcon,
  } from '@heroicons/react/24/outline';
const Navbar = () => {
  return (
    <nav className="bg-[#ECF3F3] shadow-md p-4 flex justify-between items-center">
      {/* Left Side */}
      <h1 className="text-xl font-bold text-green-700">Deluxe No.002</h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <UserIcon className="text-gray-600 cursor-pointer" size={22} />

        {/* User Profile */}
        <BellIcon className="text-gray-600 cursor-pointer" size={26} />
      </div>
    </nav>
  );
};

export default Navbar;
