export async function fetchPlacesData() {
    const response = await fetch('http://localhost:3000/places');
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Could not fetch places.');
        }
        return data.places;    
}

export async function fetchUserPlaces() {
    const response = await fetch('http://localhost:3000/user-places');
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Could not fetch places.');
        }
        return data.places;    
}

export async function putPlaceData(places) {
    const response = await fetch('http://localhost:3000/user-places', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ places: places }), // Send as an array
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Could not update places.');
    }
    
    return data.message;
  }  