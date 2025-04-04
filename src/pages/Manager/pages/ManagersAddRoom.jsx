import { useEffect, useState } from "react";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link, Navigate } from "react-router-dom";
import GetFacilities from "../../../hook/GetFacilities";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ManagersAddRoom = () => {
  const { facilities: GottenFacilities, loading: facilitiesLoading, error: facilitiesError } = GetFacilities();
  const [allAmenities, setAllAmenities] = useState([])
  const [roomData, setRoomData] = useState({
    price: "",
    roomStatus: "", // Combines room and reservation status
    roomType: "",
    roomNumber: "",
    floor: "",
    roomCapacity: "",
    bedType: "",
    amenities: [],
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [submitError, setSubmitError] = useState(null); // Error state for form submission
  const navigate = useNavigate();
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
      formData.append("roomStatus", roomData.roomStatus);
      formData.append("roomType", roomData.roomType);
      formData.append("roomNumber", roomData.roomNumber);
      formData.append("floor", roomData.floor);
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
        toast.success("Room added successfully!");
        // Reset form (optional)
        setRoomData({
          price: "",
          roomStatus: "", // Combines room and reservation status
          roomType: "",
          roomNumber: "",
          roomCapacity: "",
          bedType: "",
          amenities: [],
          images: [],
        });
        navigate("/employee/rooms")
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
    <div className="max-w-4xl p-6 mx-auto mb-10 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Add New Room</h1>

      {/* Image Upload Section */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Room Pictures</h2>
        <div className="flex flex-wrap gap-4">
          {roomData.images.map((img, index) => (
            <div key={index} className="relative w-24 h-24 overflow-hidden rounded-md">
              <img src={URL.createObjectURL(img)} alt="Room" className="object-cover w-full h-full" />
              <button
                onClick={() => removeImage(index)}
                className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1"
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
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        {/* Room Information */}
        <div>
          <label className="block text-sm font-medium">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            value={roomData.roomNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Room Floor</label>
          <input
            type="number"
            name="floor"
            value={roomData.floor}
            onChange={handleChange}
            min="1"
            max="50" // Adjust max value as needed
            placeholder="Enter floor number"
            className="w-full p-2 border border-gray-200 rounded-md"
          />
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
            <option value="Suite">Suite</option>
            <option value="Standard">Standard</option>
            <option value="Superior">Superior</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Villa">Villa</option>
            <option value="Ocean View">Ocean View</option>
            <option value="Pool View">Pool View</option>
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
            <option value="">Select</option>
            <option value="King Size">King Size</option>
            <option value="Queen Size">Queen Size</option>
            <option value="Double">Double</option>
            <option value="Twin">Twin</option>
            <option value="Single">Single</option>
            <option value="Bunk Beds">Bunk Beds</option>
          </select>
        </div>

        {/* Room Status */}
        <div>
          <label className="block text-sm font-medium">Room Status</label>
          <select
            name="roomStatus"
            value={roomData.roomStatus}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="">Select</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Under Maintenance</option>
          </select>
        </div>

        {/* Pricing */}
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
      </div>

      {/* Amenities */}
      {
        facilitiesLoading ? ( // If facilities are loading
          <div className="flex items-center justify-center p-4">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-700">Loading amenities...</span>
          </div>
        ) : facilitiesError ? ( // If there's an error
          <div className="flex items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50">
            <span className="text-red-600">Error: {facilitiesError}</span>
          </div>
        ) : ( // If data is loaded successfully
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">Room Amenities</h2>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {allAmenities.map((amenity) => (
                <label key={amenity.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={roomData.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="w-4 h-4"
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
          className="px-4 py-2 text-white bg-green-600 rounded disabled:bg-green-300"
          onClick={handleSave}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Display submission error */}
      {submitError && <p className="mt-4 text-red-500">{submitError}</p>}
    </div>
  );
};

export default ManagersAddRoom;
