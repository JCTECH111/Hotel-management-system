const CheckInOutTable = () => {
    // Sample data for check-ins and check-outs
    const checkIns = [
      { name: "John Doe", roomNumber: "101", time: "10:00 AM" },
      { name: "Jane Smith", roomNumber: "102", time: "11:30 AM" },
      { name: "Alice Johnson", roomNumber: "103", time: "12:00 PM" },
    ];
  
    const checkOuts = [
      { name: "Bob Brown", roomNumber: "201", time: "09:00 AM" },
      { name: "Charlie Davis", roomNumber: "202", time: "10:30 AM" },
      { name: "Eve Wilson", roomNumber: "203", time: "11:00 AM" },
    ];
  
    return (
      <div className="p-2 w-full overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">Check-Ins/Check-Outs Today</h1>
  
        {/* Check-Ins Table */}
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold mb-4">Check-Ins</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 whitespace-nowrap px-4 text-left">Guest Name</th>
                  <th className="py-3 whitespace-nowrap px-4 text-left">Room Number</th>
                  <th className="py-3 whitespace-nowrap px-4 text-left">Check-In Time</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((guest, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 whitespace-nowrap px-4">{guest.name}</td>
                    <td className="py-3 whitespace-nowrap px-4">{guest.roomNumber}</td>
                    <td className="py-3 whitespace-nowrap px-4">{guest.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Check-Outs Table */}
        <div className=" w-full">
          <h2 className="text-xl font-semibold mb-4">Check-Outs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 ">
                  <th className="py-3 px-4 whitespace-nowrap text-left">Guest Name</th>
                  <th className="py-3 px-4 whitespace-nowrap text-left">Room Number</th>
                  <th className="py-3 px-4 whitespace-nowrap text-left">Check-Out Time</th>
                </tr>
              </thead>
              <tbody>
                {checkOuts.map((guest, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 whitespace-nowrap px-4">{guest.name}</td>
                    <td className="py-3 whitespace-nowrap px-4">{guest.roomNumber}</td>
                    <td className="py-3 whitespace-nowrap px-4">{guest.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default CheckInOutTable;