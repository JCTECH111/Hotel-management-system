import React, { useState } from "react";
import { UserIcon, LockClosedIcon, BellIcon, GlobeAltIcon, SunIcon, MoonIcon, CogIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'
  const [language, setLanguage] = useState("en"); // 'en' for English
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Add logic to apply the theme globally
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Add logic to change the language globally
  };

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserIcon className="w-6 h-6" /> Profile
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              placeholder="+1234567890"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LockClosedIcon className="w-6 h-6" /> Password
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BellIcon className="w-6 h-6" /> Notifications
        </h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleNotificationChange("email")}
              className="w-5 h-5"
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleNotificationChange("sms")}
              className="w-5 h-5"
            />
            SMS Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.inApp}
              onChange={() => handleNotificationChange("inApp")}
              className="w-5 h-5"
            />
            In-App Notifications
          </label>
        </div>
      </div>

      {/* Language and Theme */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <GlobeAltIcon className="w-6 h-6" /> Language & Theme
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-2 rounded-lg ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                <SunIcon className="w-6 h-6" /> Light
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                <MoonIcon className="w-6 h-6" /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CogIcon className="w-6 h-6" /> Account
        </h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;