import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icons from 'react-native-vector-icons/Entypo';
import handlePunchApi from '../handlePunchApi/handlePunchApi';
import { useNavigation } from '@react-navigation/native';

const PunchScreen = () => {
  const [isPunchDisabled, setIsPunchDisabled] = useState(false);
  const [isDashboardDishabled, setIsDashboardDisabled] = useState(true);


  const navigation = useNavigation();

  const handlePunch = async () => {
    setIsPunchDisabled(true);
    setIsDashboardDisabled(false); // Enable Dashboard button when Punch is clic
    await handlePunchApi();

    setTimeout(() => {
      setIsPunchDisabled(false);
      setIsDashboardDisabled(true); // Disable Dashboard button after 5 minutes
    }, 300); // 5 minutes in milliseconds
  };

  useEffect(() => {
    if (!isPunchDisabled) {
      setIsDashboardDisabled(true);
    } else {
      setIsDashboardDisabled(false);
    }
  }, [isPunchDisabled]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View>
          <View>
            <Icon name="calendar" size={50} color="orange" />
          </View>
          <View>
            <Icons name="stopwatch" size={50} color="orange" />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.buttonContainer, isPunchDisabled ? styles.disabledButton:null]}
          onPress={handlePunch}
          disabled={isPunchDisabled}
          >
          <Text style={styles.buttonText}>Punch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonForDashboard,
            ,
            isDashboardDishabled ? styles.disabledButton :  styles.activeButton,
          ]}
          disabled={isDashboardDishabled}
        onPress={() => {}}
          >
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PunchScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '90%',
    height: '40%',
    alignSelf: 'center',
    bottom: '-25%',
    borderRadius: 15,
    borderColor: '#FDFCFA',
    backgroundColor: '#FDFCFA',
    elevation: 20,
    shadowColor: 'red',
  },
  buttonContainer: {
    borderWidth: 1,
    width: '25%',
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: 'green',
    borderColor: 'green',
    elevation: 20,
    shadowColor: 'red',
    margin: 10,
  },
  buttonForDashboard: {
    borderWidth: 1,
    width: '25%',
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: 'gray',
    borderColor: 'gray',
    elevation: 20,
    shadowColor: 'red',
    margin: 10,
  },
  disabledButton: {
    backgroundColor: 'gray',
    borderColor: 'gray',
  },
  activeButton: {
    backgroundColor: 'green', // Set the active color for Dashboard button
    borderColor: 'green',
  },
  buttonText: {
    fontWeight: '900',
    color: 'white',
    fontSize: 15,
  },
});
