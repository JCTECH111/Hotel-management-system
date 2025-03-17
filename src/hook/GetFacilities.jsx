import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch facilities from the backend
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getFacilities.php'); // Replace with your actual backend URL
        setFacilities(response.data); // Set the facilities data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return { facilities, loading, error };
}

export default GetFacilities;