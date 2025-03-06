import { BellIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const Notifications = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Notifications & Alerts</h3>
        <BellIcon className="w-6 h-6 text-gray-600" />
      </div>

      {/* Notification List */}
      <div className="space-y-4 grid md:grid-cols-2 gap-6">
        {/* Room Service Request */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <BellIcon className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-gray-700 font-medium">Room Service Request</p>
            <p className="text-sm text-gray-500">2 pending requests</p>
          </div>
        </div>

        {/* Payment Gateway Issue */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-gray-700 font-medium">Payment Gateway Issue</p>
            <p className="text-sm text-gray-500">Urgent attention required</p>
          </div>
        </div>
        {/* Room Service Request */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <BellIcon className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-gray-700 font-medium">Room Service Request</p>
            <p className="text-sm text-gray-500">2 pending requests</p>
          </div>
        </div>

        {/* Payment Gateway Issue */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-gray-700 font-medium">Payment Gateway Issue</p>
            <p className="text-sm text-gray-500">Urgent attention required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;