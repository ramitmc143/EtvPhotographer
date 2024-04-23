import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs'; // Import the react-native-fs package

import handlePunchApi from '../handlePunchApi/handlePunchApi';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraComponent = ({route}) => {
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const [showLoading, setShowLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const navigation = useNavigation();
  const {userLoginResponse} = route.params;

  useEffect(() => {
    requestPermissions();
  }, []);

  
  const requestPermissions = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera permission to capture photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs storage permission to download the image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        storagePermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
      } else {
        console.log('Permissions denied');
      }
    } catch (err) {
      console.warn('Error requesting permissions:', err);
    }
  };


  const storeImageToAsyncStorage = async imageUri => {
    try {
      // Generate a unique id for the image (you can use any method to generate id)
      const id = generateUniqueId();
      // Store imageUri with id in AsyncStorage
      await AsyncStorage.setItem(id, imageUri);
      console.log('Image stored in AsyncStorage with id:', id);
      console.log('Image URI:', imageUri); // Log the image URI as well
    } catch (error) {
      console.log('Error storing image in AsyncStorage:', error); // Log error
    }
  };

  const generateUniqueId = () => {
    // Generate a unique id (you can use any method to generate id)
    return Math.random().toString(36).substr(2, 9);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);

        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child('images/' + new Date().getTime() + '.jpg');

        await imageRef.putString(data.base64, 'base64', { contentType: 'image/jpeg' });

        const downloadUrl = await imageRef.getDownloadURL();
        setImageUri(downloadUrl);
        Alert.alert(downloadUrl)
        setShowLoading(true)
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error taking picture:', error.message);
      }
    }
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.cameraPreview}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
      />
      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.imagePreview} />
      ) : (
        <View style={{height: '8%', marginTop: '5%'}}>
          <Button title="Take Picture to punch" onPress={takePicture} />
        </View>
      )}
      <Modal animationType="slide" transparent={true} visible={showLoading}>
        <View style={{}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'grey',
              width: '80%',
              height: '40%',
              alignContent: 'center',
              top: '90%',
              left: '10%',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 19}}>
              punch in progress...please wait
            </Text>
            <TouchableOpacity
              style={{position: 'absolute', left: '5%', top: '5%'}}
              onPress={() => navigation.goBack()}>
              <Text style={{fontWeight: 'bold', color: 'red', fontSize: 17}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default CameraComponent;
