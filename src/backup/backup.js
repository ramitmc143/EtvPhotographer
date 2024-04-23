import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
// import Share from 'react-native-share';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IonIcon from 'react-native-vector-icons/Ionicons';

const TestCamera = () => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const navigation = useNavigation();

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

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(data.uri);

      // Automatically store to the gallery
      //saveToGallery(data.uri);

      // Store image URI in AsyncStorage with an id
      storeImageToAsyncStorage(data.uri);
    }
  };

  // const saveToGallery = async (imageUri) => {
  //   try {
  //     await CameraRoll.saveToCameraRoll(imageUri, 'photo');
  //     console.log('Image saved to gallery');
  //   } catch (error) {
  //     console.log('Error saving image to gallery:', error); // Log error
  //   }
  // };

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

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <RNCamera
          ref={cameraRef}
          style={{flex: 1}}
          type={
            isFrontCamera
              ? RNCamera.Constants.Type.front
              : RNCamera.Constants.Type.back
          }
          captureAudio={false}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            marginTop: 5,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <IonIcon
            name="chevron-back-outline"
            size={25}
            color="white"
            style={{alignSelf: 'center', marginTop: 1}}
          />
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={takePicture}
            style={{
              height: 80,
              width: 80,
              borderRadius: 80,

              borderWidth: 2,
              backgroundColor: '#fff',
            }}
          />
          <TouchableOpacity
            onPress={toggleCamera}
            style={{
              height: 46,
              width: 46,
              borderRadius: 46,
              borderColor: '#000',
              borderWidth: 1,
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}>
            <IonIcon
              name={isFrontCamera ? 'camera-reverse-outline' : 'camera-outline'}
              size={35}
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
        {capturedImage && (
          <>
            <Image
              source={{uri: capturedImage}}
              style={{
                height: 100,
                width: 100,
                alignSelf: 'center',
                borderRadius: 5,
                marginTop: 10,
              }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TestCamera;

const styles = StyleSheet.create({
  btnText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
});
