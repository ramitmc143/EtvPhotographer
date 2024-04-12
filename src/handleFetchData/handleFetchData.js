import { View, Text } from 'react-native'
import React from 'react'

const handleFetchData = async ({route}) => {
    const {userLoginData} = route.params;
   
        const employeeResponse = await handleEmployeeApi();
        // setEmployeeData(employeeResponse.data);
        const userLoginAsyncData = await AsyncStorage.getItem('userLoginData');
        const parsedUserLoginDataAsyncData = JSON.parse(userLoginAsyncData);
        if (parsedUserLoginDataAsyncData) {
          console.log(
            'parsedUserLoginDataAsyncData stored in userLoginResponse state',
          );
          return parsedUserLoginDataAsyncData;
        } else {
          console.log('userLoginData stored in userLoginResponse state');
          return userLoginData;
        }
      
}

export default handleFetchData;