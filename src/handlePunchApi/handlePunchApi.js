import { View, Text } from 'react-native'
import React from 'react';
import punchData from '../punchData/punchData';

const handlePunchApi = async (userLoginResponse ,imageUri) => {

   const storedPunchData = await punchData(userLoginResponse,imageUri);
   console.log('storedPunchData:-',storedPunchData)
   
     
    const url = 'http://172.17.15.218/etvtracker/Api/punch_data';

  try {
  const response =   await  fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body : JSON.stringify(storedPunchData)
    });

    if (!response.ok) {
        console.log("Network response was not ok")
    }
    console.log('Punch data sent successfully :');
    return true
  } catch (error) {
    console.log('Error sending punch data : ', error);
    return false;
  }
  
}

export default handlePunchApi;