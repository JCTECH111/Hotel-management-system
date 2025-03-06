import {
    HomeIcon,
    UserGroupIcon,
    CheckIcon,
    WrenchIcon,
    ClockIcon,
  } from "@heroicons/react/24/outline";
  
  const DashboardStats = () => {
    const roomStats = [
      {
        title: "Total Rooms",
        value: "100",
        icon: <HomeIcon className="w-8 h-8 text-green-500" />,
      },
      {
        title: "Occupied Rooms",
        value: "80",
        icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      },
      {
        title: "Available Rooms",
        value: "20",
        icon: <CheckIcon className="w-8 h-8 text-green-500" />,
      },
      {
        title: "Under Maintenance",
        value: "5",
        icon: <WrenchIcon className="w-8 h-8 text-yellow-500" />,
      },
      {
        title: "Reserved Rooms",
        value: "15",
        icon: <ClockIcon className="w-8 h-8 text-purple-500" />,
      },
      {
        title: "Room Occupancy Rate",
        value: "80%",
        icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roomStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default DashboardStats;