import React, { useEffect, useState } from "react";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link, useParams, useNavigate } from "react-router-dom";
import GetFacilities from "../../../hook/GetFacilities";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditRoom = () => {
  const { id } = useParams(); // Get roomId from URL
  const navigate = useNavigate();
  const { facilities: GottenFacilities, loading: facilitiesLoading, error: facilitiesError } = GetFacilities();
  const [allAmenities, setAllAmenities] = useState([]);
  const [roomData, setRoomData] = useState({
    price: "",
    roomStatus: "",
    roomType: "",
    roomNumber: "",
    floor: "",
    roomCapacity: "",
    bedType: "",
    amenities: [],
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch room details when the component mounts
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getValueForEditingRoom.php?roomId=${id}`);
        const room = response.data;

        // Update roomData with fetched room details
        setRoomData({
          price: room.price,
          roomStatus: room.status,
          roomType: room.type,
          roomNumber: room.room_number,
          floor: room.floor,
          roomCapacity: room.capacity,
          bedType: room.bed_type,
          amenities: room.facility_names || [],
          images: room.image_url || [], // Assuming image_url is an array of image URLs
        });
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error("Failed to fetch room details.");
      }
    };

    fetchRoomDetails();
  }, [id]);

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
  const toggleAmenity = (amenityId) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId.toString()) // Compare as strings
        ? prev.amenities.filter((id) => id !== amenityId.toString()) // Remove if already exists
        : [...prev.amenities, amenityId.toString()], // Add if not exists
    }));
  };

  // Handle save changes
  const handleSave = async () => {
    if (!roomData.roomNumber || !roomData.roomType || !roomData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

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
      formData.append("amenities", JSON.stringify(roomData.amenities));

      // Append each image file
      roomData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images[]", image);
        } else {
          console.error(`Invalid file at index ${index}:`, image);
        }
      });

      // Send PUT request to backend to update the room
      const response = await axios.put(`http://localhost:8000/editRoom.php?roomId=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response)

    //   if (response.status === 200) {
    //     toast.success("Room updated successfully!");
    //     navigate("/employee/rooms");
    //   }
    } catch (error) {
      setSubmitError("Failed to update room. Please try again.");
      toast.error("Failed to update room. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mb-10">
      <h1 className="text-2xl font-bold mb-6">Edit Room</h1>

      {/* Image Upload Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Room Pictures</h2>
        <div className="flex gap-4 flex-wrap">
          {roomData.images.map((img, index) => (
            <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden">
              <img
                src={typeof img === "string" ? img : URL.createObjectURL(img)} // Handle both URLs and File objects
                alt="Room"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 flex items-center justify-center border-[2px] border-dashed border-gray-200 cursor-pointer text-gray-500">
            <input type="file" multiple className="hidden" onChange={handleImageUpload} />
            <PlusIcon className="w-6 h-6" />
          </label>
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            max="50"
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
      {facilitiesLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-700">Loading amenities...</span>
        </div>
      ) : facilitiesError ? (
        <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600">Error: {facilitiesError}</span>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Room Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allAmenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={roomData.amenities.includes(amenity.id.toString())}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="h-4 w-4"
                />
                <span>{amenity.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between">
        <Link to="/employee/rooms">
          <button className="px-4 py-2 bg-red-500 rounded">Close</button>
        </Link>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Display submission error */}
      {submitError && <p className="text-red-500 mt-4">{submitError}</p>}
    </div>
  );
};

export default EditRoom;