import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetRooms() {
  const [roomsValue, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch rooms from the backend
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getRooms.php'); // Replace with your actual backend URL
        setRooms(response.data); // Set the rooms data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { roomsValue, loading, error };
}

export default GetRooms;