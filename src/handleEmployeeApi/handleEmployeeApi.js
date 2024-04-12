import { View, Text } from 'react-native'
import React from 'react'

const handleEmployeeApi = async () => {
 try {
    const responseData = await fetch('http://172.17.15.218/etvtracker/Api/punch_uesrs_data')

    if (!responseData.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await responseData.json();
    console.log('data :--',data);
    return data;
    
 } catch (error) {
    console.log("These was a problem with your fetch operation", error)
   //  throw error;
   // return []; // or handle the error in another way
 }
  
}

export default handleEmployeeApi