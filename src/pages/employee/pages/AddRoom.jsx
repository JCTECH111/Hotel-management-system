import { useEffect, useState } from "react";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import GetFacilities from "../../../hook/GetFacilities";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const AddRoom = () => {
  const { facilities: GottenFacilities, loading: facilitiesLoading, error: facilitiesError } = GetFacilities();
  const [allAmenities, setAllAmenities] = useState([])
  const [roomData, setRoomData] = useState({
    price: "",
    reservationStatus: "",
    roomType: "",
    roomNumber: "",
    roomStatus: "",
    foStatus: "",
    roomCapacity: "",
    bedType: "",
    amenities: [],
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [submitError, setSubmitError] = useState(null); // Error state for form submission
  // Update allAmenities when GottenFacilities changes
  useEffect(() => {
    if (GottenFacilities.length > 0) {
      setAllAmenities(GottenFacilities);
    }
  }, [GottenFacilities]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + roomData.images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
    setRoomData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Handle removing an image
  const removeImage = (index) => {
    setRoomData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle amenity selection
  const toggleAmenity = (amenity) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Handle save changes
  const handleSave = async () => {
    if (!roomData.roomNumber || !roomData.roomType || !roomData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true); // Start loading
    setSubmitError(null); // Reset error state

    try {
      // Prepare form data for file uploads
      const formData = new FormData();
      formData.append("price", roomData.price);
      formData.append("reservationStatus", roomData.reservationStatus);
      formData.append("roomType", roomData.roomType);
      formData.append("roomNumber", roomData.roomNumber);
      formData.append("roomStatus", roomData.roomStatus);
      formData.append("foStatus", roomData.foStatus);
      formData.append("roomCapacity", roomData.roomCapacity);
      formData.append("bedType", roomData.bedType);
      formData.append("amenities", JSON.stringify(roomData.amenities)); // Convert array to JSON string
    
       // Append each image file
    roomData.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append("images[]", image); // Append each image file
      } else {
        console.error(`Invalid file at index ${index}:`, image);
      }
    });


     // Log FormData contents
// for (let [key, value] of formData.entries()) {
//   console.log(key, value);
// }
   

      // Send POST request to backend
      const response = await axios.post("http://localhost:8000/addRoom.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
        console.log(response)
      // Handle success
      if (response.status === 201) {
        toast.error("Room added successfully!");
        // Reset form (optional)
        setRoomData({
          price: "",
          reservationStatus: "",
          roomType: "",
          roomNumber: "",
          roomStatus: "",
          foStatus: "",
          roomCapacity: "",
          bedType: "",
          amenities: [],
          images: [],
        });
      }
    } catch (error) {
      // Handle error
      setSubmitError("Failed to save room. Please try again.");
      toast.error("Failed to save room. Please try again.")
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mb-10">
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>

      {/* Image Upload Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Room Pictures</h2>
        <div className="flex gap-4 flex-wrap">
          {roomData.images.map((img, index) => (
            <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden">
              <img src={URL.createObjectURL(img)} alt="Room" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 flex items-center justify-center border-[2px] border-dashed border-gray-200  border-gray-200-dashed cursor-pointer text-gray-500">
            <input type="file" multiple className="hidden" onChange={handleImageUpload} />
            <PlusIcon className="w-6 h-6" />
          </label>
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Room Price (₦)</label>
          <input
            type="number"
            name="price"
            value={roomData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Reservation Status</label>
          <select name="reservationStatus" value={roomData.reservationStatus} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-md">
            <option value="">Select</option>
            <option value="Reserved">Reserved</option>
            <option value="Not Reserved">Not Reserved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Room Type</label>
          <select
            name="roomType"
            value={roomData.roomType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="">Select</option>
            {/* Standard Room Types (for normal hotels) */}
            <option value="Standard">Standard</option>
            <option value="Superior">Superior</option>
            <option value="Family Room">Family Room</option>
            <option value="Twin Room">Twin Room</option>
            <option value="Double Room">Double Room</option>
            <option value="Single Room">Single Room</option>
            {/* Luxury Room Types (for 5-star hotels) */}
            <option value="Deluxe">Deluxe</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Presidential Suite">Presidential Suite</option>
            <option value="Penthouse Suite">Penthouse Suite</option>
            <option value="Villa">Villa</option>
            <option value="Ocean View Room">Ocean View Room</option>
            <option value="Pool View Room">Pool View Room</option>
            <option value="Honeymoon Suite">Honeymoon Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Room Number</label>
          <input type="text" name="roomNumber" value={roomData.roomNumber} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium">Room Status</label>
          <select
            name="roomStatus"
            value={roomData.roomStatus}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="">Select</option>
            <option value="Clean">Clean</option>
            <option value="Dirty">Dirty</option>
            <option value="Inspected">Inspected</option>
            <option value="Out of Service">Out of Service</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Ready for Check-In">Ready for Check-In</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium">Room Capacity</label>
          <input
            type="number"
            name="roomCapacity"
            value={roomData.roomCapacity}
            onChange={handleChange}
            min="1"
            max="10"
            placeholder="Enter number of guests"
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bed Type</label>
          <select
            name="bedType"
            value={roomData.bedType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="King Size">King Size</option>
            <option value="Queen Size">Queen Size</option>
            <option value="Double">Double</option>
            <option value="Twin">Twin</option>
            <option value="Single">Single</option>
            <option value="Bunk Beds">Bunk Beds</option>
          </select>
        </div>
      </div>

      {/* Amenities */}
      {
        facilitiesLoading ? ( // If facilities are loading
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-700">Loading amenities...</span>
          </div>
        ) : facilitiesError ? ( // If there's an error
          <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-600">Error: {facilitiesError}</span>
          </div>
        ) : ( // If data is loaded successfully
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Room Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allAmenities.map((amenity) => (
                <label key={amenity.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={roomData.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="h-4 w-4"
                  />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        )
      }


      {/* Buttons */}
      <div className="flex justify-between">
        <Link to="/employee/rooms">
          <button className="px-4 py-2 bg-red-500 rounded">Close</button>
        </Link>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300"
          onClick={handleSave}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Display submission error */}
      {submitError && <p className="text-red-500 mt-4">{submitError}</p>}
    </div>
  );
};

export default AddRoom;
