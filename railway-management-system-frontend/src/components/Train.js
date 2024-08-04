import React, { useState, useEffect } from 'react';
import { getTrains } from '../api';

const Train = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await getTrains();
        setTrains(response.data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      }
    };

    fetchTrains();
  }, []);

  return (
    <div>
      <h2>Trains</h2>
      <ul>
        {trains.map(train => (
          <li key={train.train_id}>
            {train.train_name} - {train.source} to {train.destination}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Train;
