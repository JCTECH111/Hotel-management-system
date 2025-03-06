const DashboardHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Good morning, JoeCode 👑🎖️!</h2>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <span className="text-gray-600">{new Date().toDateString()}</span>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            + New Reservation
          </button>
        </div>
      </div>
    );
  };
  
  export default DashboardHeader;
  