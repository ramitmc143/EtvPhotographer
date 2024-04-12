import DeviceInfo from 'react-native-device-info';
import GetFcmToken from '../fcmToken/GetFcmToken';
import GetCurrentLocation from '../getCurrentLocation/GetCurrentLocation';

const userDetails = async () => {
  const deviceId = DeviceInfo.getDeviceId();
  const deviceType = DeviceInfo.getDeviceType();
  const fcmToken = await GetFcmToken();
  const current_address = await GetCurrentLocation();

  const userDetails = {
    device_id: deviceId,
    fcm_token: fcmToken,
    address: current_address,
    device_type: deviceType
  };

  return userDetails;
};

export default userDetails;
