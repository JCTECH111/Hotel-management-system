import { useState } from "react";

const RoomEdit = () => {
  const [roomDetails, setRoomDetails] = useState({
    price: 340,
    reservationStatus: "Not Reserved",
    roomType: "Deluxe",
    roomNumber: "002",
    roomStatus: "Clean",
    returnStatus: "Ready",
    foStatus: "Vacant",
    roomClass: "Main",
    roomCapacity: "2-4 Guests",
    bedType: "King Size",
  });

  const amenities = [
    "Shower",
    "Safe Box",
    "Luggage",
    "Concierge",
    "Morning Sunlight",
    "Sea View",
    "Refrigerator",
    "Air Conditioner",
    "TV Cable",
    "Internet",
  ];

  const selectedAmenities = ["Shower", "Sea View", "Refrigerator", "Internet"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto mb-10">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Room Edit</h2>

      {/* Room Pictures */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Room Picture</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-20 bg-gray-200 flex items-center justify-center">📷</div>
          <div className="h-20 bg-gray-200 flex items-center justify-center">📷</div>
          <div className="h-20 bg-gray-200 flex items-center justify-center">📷</div>
          <div className="h-20 bg-gray-100 flex items-center justify-center border-dashed border-2">
            + Add Image
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.keys(roomDetails).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-semibold mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <select
              className="border p-2 rounded-md"
              value={roomDetails[key]}
              onChange={(e) => setRoomDetails({ ...roomDetails, [key]: e.target.value })}
            >
              <option>{roomDetails[key]}</option>
              {/* Add other options dynamically based on key */}
            </select>
          </div>
        ))}
      </div>

      {/* Room Amenities */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Room Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedAmenities.includes(amenity)}
                readOnly
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Close</button>
        <button className="bg-green-600 text-white px-6 py-2 rounded">Save Changes</button>
      </div>
    </div>
  );
};

export default RoomEdit;
