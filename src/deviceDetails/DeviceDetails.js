import { View, Text } from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import getCurrentLocation from '../getCurrentLocation/GetCurrentLocation';
import generateFcmToken from '../fcmToken/GetFcmToken';

const deviceDetails = async () => {
  const deviceId = await DeviceInfo.getUniqueId();
  const deviceType = DeviceInfo.getSystemName();
  const location = await getCurrentLocation();
  const fcmToken = await generateFcmToken();

  const userDetails = {
    device_id: deviceId,
    device_type: deviceType,
    fcm_token: fcmToken,
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
  };

  return userDetails;
};

export default deviceDetails;
