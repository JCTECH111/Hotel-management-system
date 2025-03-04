import React from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  HomeIcon,
  UserIcon,
  BanknotesIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
    return (
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
    
          {/* Main Content Area */}
          <div className="flex-1">
            <Navbar />
            
            {/* Main Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-700">Welcome to Room Management</h2>
            </div>
          </div>
        </div>
      );
};

export default Home;