import Geolocation from '@react-native-community/geolocation';

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
    async  position => {
       try {
        const {latitude , longitude} = position.coords;
        const address = await getAddressFromCoordinates(latitude,longitude);
        resolve({latitude,longitude,address});
       } catch (error) {
        // reject(error)
        console.log('getting location error: ', error);
       }
      },
      error => {
        console.log('Error getting location: ', error);
        // reject(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  });
};

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.log("Error fetching address: ", error);
    throw error;
  }
};

export default getCurrentLocation;
