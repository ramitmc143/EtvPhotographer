import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app'; // Add this import
import { Platform } from 'react-native';

// Initialize Firebase with correct configuration options (add this function)


const androiAppId = '1:814673463720:android:e24306e15aeb38a484759d';
const iosAppId = '1:814673463720:ios:b2058f257862edf684759d';

const isIos = Platform.OS === 'ios';


const initializeFirebase = async () => {
  try {
    if (!firebase.apps.length) {
      await firebase.initializeApp({
        // Add your Firebase configuration options here
        // For example:
        apiKey: 'AIzaSyCRQOCvHa3nIXDIXXmkfxZpkRFmtR-ZXH8',
        authDomain: 'hrms-d32d7.firebaseapp.com',
        projectId: 'hrms-d32d7',
        appId: isIos ? iosAppId : androiAppId ,
        databaseURL: 'https://hrms-d32d7.firebaseio.com', // Add this line
        messagingSenderId: '814673463720', // Add this line
        storageBucket: 'hrms-d32d7.appspot.com',
      });
    }
  } catch (error) {
    console.log('Error initializing Firebase:', error);
  }
};

// Call initializeFirebase before calling getToken
const generateFcmToken = async () => {
  try {
    await initializeFirebase(); // Initialize Firebase
    const token = await messaging().getToken();
    // const token = await FirebaseMessaging.instance.getToken();
    if (token) {
      return token;
    } else {
      const newToken = await messaging().getToken();
      // const newToken = await FirebaseMessaging.instance.getToken();
      return newToken;
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};

export default generateFcmToken;
