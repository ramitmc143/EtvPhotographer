import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import handlePostApi from '../handlePostApi/HandlePostApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [marginTop, setMarginTop] = useState(0);
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('etv@321');
  const [userLoginData, setUserLoginData] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
        setMarginTop(20);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
        setMarginTop(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getImageDimensions = () => {
    if (isKeyboardOpen) {
      return {
        width: Dimensions.get('window').width * 0.23,
        height: Dimensions.get('window').height * 0.09,
      };
    } else {
      return {
        width: '25%',
        height: '10%',
      };
    }
  };

  const loginApi = async () => {
    try {
      const response = await fetch(
        `http://172.17.15.218/etvtracker/Api/getuserlogin?username=${username}&password=${password}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      // setUserLoginData(response)
      const jsonData = await response.json();
      setUserLoginData(jsonData);
      await AsyncStorage.setItem('userLoginData', JSON.stringify(jsonData));
      if (jsonData.data.name === username) {
        // navigation.navigate('punchScreen');
        navigation.navigate('dashboard', {userLoginData: userLoginData});
        Alert.alert('loggedIn successfully');
        await handlePostApi();
      } else {
        Alert.alert('username and password did not match');
      }
    } catch (error) {
      console.log('Error fetching Data : ', error);
      Alert.alert('something went wrong. Please try again.');
    }
  };

  const handleLogin = async () => {
    // await loginApi();
    navigation.navigate('dashboard');
  };

  const {width, height} = getImageDimensions();

  return (
    <View style={styles.container}>
    
        <Image
          source={require('../Assets/Etv_logo.jpg')}
          style={[styles.image, {width, height, marginTop},{marginTop:"10%"}]}
        />
     
      <View style={{top: '-16%', left: '-40%'}}>
        <Text> 𝐏𝐡𝐨𝐭𝐨𝐠𝐫𝐚𝐩𝐡𝐞𝐫</Text>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.label}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your EmployeeId"
            placeholderTextColor="#555"
            onChangeText={usrname => setUsername(usrname)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#555"
            secureTextEntry={true}
            onChangeText={pswrd => setPassword(pswrd)}
          />
          <TouchableOpacity style={styles.loginButton} onPress={loginApi}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.poweredMc}>
        <Text style={{fontSize: 14, color: '#8B8989', fontWeight: 'bold'}}>
          Powered by Margadarsi Computers
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FDFCFA',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ecf0f1',
    width: '100%',
    height: '60%',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: '#f0f8ff',
    borderColor: '#cccccc',
  },
  shadowProp: {
    elevation: 10,
    shadowOffset: {width: -2, height: 4},
    shadowColor: 'red',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#333',
    borderRadius: 10,
    elevation: 15,
    shadowColor: 'red',
    backgroundColor: '#f0f8ff',
  },
  loginButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: '#2980b9',
    borderWidth: 1,
    width: '40%',
    elevation: 15,
    shadowColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  image: {
    width: '25%',
    height: '10%',
    resizeMode: 'cover',
    left: '-40%',
    top: '-16%',
  },
  poweredMc: {
    bottom: '-11%',
  },
});

export default LoginScreen;
