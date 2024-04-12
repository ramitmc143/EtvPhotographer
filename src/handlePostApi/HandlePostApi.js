import deviceDetails from "../deviceDetails/DeviceDetails";
// import userDetails from "../userDetails/userDetails";

const handlePostApi = async () => {

  const userData = await deviceDetails();
  console.log('userData:', userData);

  const options = {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  try {
    let response = await fetch('http://172.17.15.218/etvtracker/Api/insert_data_fcm', options);
    let responseData = await response.text();

    console.log('Response:', responseData);

    if (response.ok) {
      // Handle successful response
    } else {
      let errorData;
      try {
        errorData = JSON.parse(responseData);
      } catch (parseError) {
        errorData = { message: 'Unknown error occurred' };
      }
      throw new Error(errorData.message || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: 'Something went wrong' };
  }
};

export default handlePostApi;
