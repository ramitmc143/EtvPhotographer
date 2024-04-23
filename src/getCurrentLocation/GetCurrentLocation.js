import Geolocation from '@react-native-community/geolocation';

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    const getCoordinates = () => {
      Geolocation.getCurrentPosition(
        async position => {
          try {
            const {latitude, longitude} = position.coords;
            const address = await getAddressFromCoordinates(latitude, longitude);
            resolve({latitude, longitude, address});
          } catch (error) {
            console.log('Getting location error: ', error);
            getCoordinates(); // Call getCoordinates again if an error occurs
          }
        },
        error => {
          console.log('Error getting location: ', error);
          getCoordinates(); // Call getCoordinates again if an error occurs
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    };

    getCoordinates(); // Initial call to getCoordinates
  });
};

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.log('Error fetching address: ', error);
    throw error;
  }
};

export default getCurrentLocation;
