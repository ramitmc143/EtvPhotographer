// RouteApp.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../logInScreen/LoginScreen';
import WorkAllocation from '../workAllocation/WorkAllocation';
import TodayWork from '../todayWork/TodayWork';
import Dashboard from '../dashboard/Dashboard';
import FilteredData from '../filteredData/FilteredData';
import GetCurrentLocation from '../getCurrentLocation/GetCurrentLocation';
import PunchScreen from '../punchScreen/PunchScreen';
import CameraComponent from '../camera/CameraComponent';


const Stack = createNativeStackNavigator();

const RouteApp = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerTitleAlign: 'center', headerShown: false}}>
      {/* <Stack.Screen name="getCurrentLocation" component={GetCurrentLocation} /> */}
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="WorkAllocation" component={WorkAllocation} />
      <Stack.Screen name="todayWork" component={TodayWork} />
      <Stack.Screen name="dashboard" component={Dashboard} />
      {/* <Stack.Screen name="filteredData" component={FilteredData} /> */}
      <Stack.Screen name="punchScreen"  component={PunchScreen} />
      <Stack.Screen name='camera' component={CameraComponent} />
    </Stack.Navigator>
  );
};

export default RouteApp;
