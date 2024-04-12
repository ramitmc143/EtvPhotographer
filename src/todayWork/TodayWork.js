import {View, Text, StyleSheet, TouchableOpacity,Image} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';


const TodayWork = () => {

const navigation = useNavigation();

  // Sample dynamic data
  const dynamicData = ['Today', 'Salar', 'Bahubali Set'];

  // Static data for the first column
  const staticData = ['Day', 'Work', 'Location'];

  // Combine static and dynamic data
  const tableData = staticData.map((staticValue, index) => [
    staticValue,
    dynamicData[index],
  ]);

  return (
    <View style={{flex: 1, justifyContent: 'center',backgroundColor:'#FDFCFA'}}>
      <Image source={require('../Assets/Etv_logo.jpg')} 
      style={styles.image}
      />
      <Text
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 19,
          fontWeight: 'bold',
          color: '#eb5e34',
        }}>
        Today's Work
      </Text>
      <View style={[styles.container, styles.shadowprop]}>
        {/* Table Rows */}
        {tableData.map((rowData, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {rowData.map((cellData, cellIndex) => (
              <Text key={cellIndex} style={styles.tableCell}>
                {cellData}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn}
       onPress={() => navigation.navigate('dashboard')}
      >
        <Text style={styles.textbnt}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodayWork;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '35   %',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
  },
  shadowprop: {
    elevation: 10,
    shadowOffset: {width: -2, height: 4},
    shadowColor: 'red',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: '7%', // Adjust the padding as needed
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: 'black',
  },
  btn: {
    borderWidth: 1,
    // justifyContent:'center',
    width: '20%',
    height: '5%',
    alignSelf: 'center',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderRadius: 8,
    borderColor: 'green',
    elevation: 15,
    shadowColor: 'red',
  },
  textbnt: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  image: {
    width: '25%',
    height: '10%',
    resizeMode: 'cover',
    left: '0.5%',
    top: '-18.5%',
    
  },
});
