const BookingTable = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Booking Activities</h3>
  
        {/* Responsive Scroll Wrapper */}
        <div className="overflow-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 whitespace-nowrap">Book ID</th>
                <th className="p-3 whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Room</th>
                <th className="p-3 whitespace-nowrap">Check-in</th>
                <th className="p-3 whitespace-nowrap">Check-out</th>
                <th className="p-3 whitespace-nowrap">Guest</th>
                <th className="p-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3">555013</td>
                <td className="p-3">Boyd Briggs</td>
                <td className="p-3">Deluxe</td>
                <td className="p-3">Thu, 23 Mar 2023</td>
                <td className="p-3">Sat, 25 Mar 2023</td>
                <td className="p-3">1 Person</td>
                <td className="p-3 text-blue-500 font-semibold">In house</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default BookingTable;
  