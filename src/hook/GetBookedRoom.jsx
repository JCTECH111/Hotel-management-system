import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetBookedRoom() {
  const [bookedRoom, setBookedRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    // Function to fetch BookedRoom from the backend
    const fetchBookedRoom = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getBookedRoom.php'); // Replace with your actual backend URL
        setBookedRoom(response.data); // Set the BookedRoom data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookedRoom();
  }, []);

  return { bookedRoom, loading, error };
}

export default GetBookedRoom;