const CheckInList = () => {
    const checkIns = [
      { name: "Alex", room: 102, time: "2 PM" },
      { name: "Bella", room: 205, time: "4 PM" },
    ];
  
    return (
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Today's Check-Ins</h3>
        <ul className="space-y-3">
          {checkIns.map((guest, index) => (
            <li key={index} className="flex justify-between text-gray-700 bg-gray-100 p-3 rounded-md shadow">
              <span>{guest.name}</span>
              <span className="font-bold">Room {guest.room}</span>
              <span className="text-green-600">{guest.time}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default CheckInList;
  