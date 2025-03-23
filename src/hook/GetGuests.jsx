import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    // Function to fetch guests from the backend
    const fetchGuests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getGuests.php'); // Replace with your actual backend URL
        setGuests(response.data); // Set the guests data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  return { guests, loading, error };
}

export default GetGuests;