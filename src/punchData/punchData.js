import { View, Text } from 'react-native'
import React from 'react'
import deviceDetails from '../deviceDetails/DeviceDetails';
import recordPunch from '../recordPunch/recordPunchTime';

const punchData = async (userLoginResponse ,imageUri) => {
    const deviceData  = await deviceDetails();
    const deviceId = deviceData.device_id;
    const deviceType = deviceData.device_type;
    const locationName =  deviceData.address;
    const latitude = deviceData.latitude;
    const longitude = deviceData.longitude;
    const punchTime =  await  recordPunch();
    const userName = userLoginResponse.data.name;
    const Phone =  userLoginResponse.data.phone;

 


    const punchData = {
        device_id : deviceId,
        address: locationName,
        device_type: deviceType,
        punch_in:punchTime,
        user_name:userName,
        phone_no : Phone,
        lattitude_longitude: `${latitude} , ${longitude}`
        // longitude:longitude,
        // image:imageUri
    }
  return punchData;
}

export default punchData