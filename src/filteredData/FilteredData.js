import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const FilteredData = ({route}) => {
  const [filterData, setFilterData] = useState([]);
  const navigation = useNavigation();

  const {selectedData, onBack} = route.params;

  const getDisplayDate = dateString => {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    if (
      inputDate.getDate() === currentDate.getDate() &&
      inputDate.getMonth() === currentDate.getMonth() &&
      inputDate.getFullYear() === currentDate.getFullYear()
    ) {
      return 'Today';
    } else if (
      inputDate.getDate() === currentDate.getDate() - 1 &&
      inputDate.getMonth() === currentDate.getMonth() &&
      inputDate.getFullYear() === currentDate.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      return dateString;
    }
  };

  useEffect(() => {
    setFilterData(selectedData);
  }, [selectedData]); // Update state when data prop changes

  const handleBackPress = () => {
    // Call the onBack function passed from Dashboard to refresh data if needed
    // onBack();
    // Navigate back to the Dashboard component
    // navigation.goBack();
    // navigation.navigate('dashboard',{
    //   onBack : (updatedData) => {
    //     // Update allData with the updatedData array
    //     setAllData([...updatedData]);
    //  }
    // }

    // );
    navigation.navigate('loginScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress}>
        <Text>Back</Text>
      </TouchableOpacity>
      {filterData.map((data, index) => (
        <View key={index} style={styles.dataCardItem}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.label, {alignSelf: 'center'}]}>Date:</Text>
            <Text style={{marginLeft: '2%', alignSelf: 'center'}}>
              {getDisplayDate(data.date)}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Punch In: </Text>
            <Text style={{marginLeft: '2%', alignSelf: 'center'}}>
              {data.punchIn}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Punch Out:</Text>
            <Text style={{marginLeft: '2%', alignSelf: 'center'}}>
              {data.punchOut}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Work Status:</Text>
            <Text style={{marginLeft: '2%', alignSelf: 'center'}}>
              {data.workStatus}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dataCardItem: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: 'grey',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilteredData;
