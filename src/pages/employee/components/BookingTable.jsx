const BookingTable = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-14">
        <h3 className="text-lg font-semibold mb-4">Booking Activities</h3>
  
        {/* Responsive Scroll Wrapper */}
        <div className="overflow-auto">
          <table className="w-full min-w-[600px] border-collapse ">
            <thead>
              <tr className="bg-gray-200  text-left">
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
              <tr className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 whitespace-nowrap">555013</td>
                <td className="p-3 whitespace-nowrap">Boyd Briggs</td>
                <td className="p-3 whitespace-nowrap">Deluxe</td>
                <td className="p-3 whitespace-nowrap">Thu, 23 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">Sat, 25 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">1 Person</td>
                <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">In house</td>
              </tr>
              <tr className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 whitespace-nowrap">555013</td>
                <td className="p-3 whitespace-nowrap">Boyd Briggs</td>
                <td className="p-3 whitespace-nowrap">Deluxe</td>
                <td className="p-3 whitespace-nowrap">Thu, 23 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">Sat, 25 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">1 Person</td>
                <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">In house</td>
              </tr>
              <tr className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 whitespace-nowrap">555013</td>
                <td className="p-3 whitespace-nowrap">Boyd Briggs</td>
                <td className="p-3 whitespace-nowrap">Deluxe</td>
                <td className="p-3 whitespace-nowrap">Thu, 23 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">Sat, 25 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">1 Person</td>
                <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">In house</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default BookingTable;
  