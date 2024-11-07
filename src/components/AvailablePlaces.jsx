import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import {sortPlacesByDistance} from '../loc.js';
import {fetchPlacesData} from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Initialize error properly

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const places = await fetchPlacesData();
        // Use geolocation to sort places
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const sortedPlaces = sortPlacesByDistance(
              places,
              position.coords.latitude,
              position.coords.longitude
            );
            setAvailablePlaces(sortedPlaces);
            setIsLoading(false); 
          },
          (error) => {
            setError({ message: 'Failed to retrieve geolocation.' });
            setIsLoading(false);
          }
        );
      } catch (error) {
        setError({ message: error.message || 'Could not fetch places. Please try again later.' });
        setIsLoading(false); // Ensure loading is false in case of error
      }
    }
    fetchPlaces();
  }, []);

  // Error handling
  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  // Render places if available
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Loading places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
