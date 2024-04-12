import React, {useState, useRef} from 'react';
import {View, StyleSheet, Button, Alert, Image ,Modal,Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import handlePunchApi from '../handlePunchApi/handlePunchApi';
import {useNavigation} from '@react-navigation/native';

const CameraComponent = ({route}) => {
  const [imageUri, setImageUri] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const {userLoginResponse} = route.params;
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef.current.takePictureAsync(options);
        setImageUri(data.uri);

        // if (!userLoginResponse || !userLoginResponse.userLoginData) {
        //   throw new Error('userLoginResponse or userLoginData is undefined');
        // }
        setShowLoading(true)

        const response = await handlePunchApi(userLoginResponse, data.uri);
        if (response) {
          navigation.navigate('dashboard', {
            userLoginResponse: userLoginResponse,
          });
          setShowLoading(false)
          Alert.alert('you have punched successfully');
        } else {
          Alert.alert('Something went wrong in punch');
        }
        // navigation.navigate('dashboard',{userLoginResponse:userLoginResponse});
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
        <Button title="Take Picture" onPress={takePicture} />
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
