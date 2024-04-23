import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
// import Share from 'react-native-share';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import handlePunchApi from '../handlePunchApi/handlePunchApi';
import IonIcon from 'react-native-vector-icons/Ionicons';

const TestCamera = ({route}) => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
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
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {quality: 0.5, base64: true, width: 300, height: 300}; // Set the desired width
        const data = await cameraRef.current.takePictureAsync(options);

        setCapturedImage(data.uri)
        // Read the captured image file as base64
        // Base64 Encoding
        const base64Image = await RNFS.readFile(data.uri, 'base64');

        // console.log('base64Image--', base64Image);

        // Convert the base64 image to a Data URI
        const dataUri = `data:image/jpeg;base64,${base64Image}`;

        console.log('dataUri--', dataUri);

        setShowLoading(true);

        const response = await handlePunchApi(userLoginResponse, dataUri);
        if (response) {
          navigation.navigate('dashboard', {
            userLoginResponse: userLoginResponse,
          });
          setShowLoading(false);
          Alert.alert('You have punched successfully');
        } else {
          setShowLoading(false);
          Alert.alert('Something went wrong in punch');
        }
      } catch (error) {
        setShowLoading(false);
        console.error('Error in takePicture:', error);
        Alert.alert('Error in takePicture:', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <RNCamera
          ref={cameraRef}
          style={{flex: 1}}
          type={RNCamera.Constants.Type.front}
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
              justifyContent: 'center',
              borderColor: 'green',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'green',
                textAlign: 'center',
                fontSize: 17,
              }}>
              Punch
            </Text>
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
