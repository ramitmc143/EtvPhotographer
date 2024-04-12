import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

const WorkAllocation = () => {
  const navigation = useNavigation();

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // State for input fields and checkboxes
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [valueCheckbox, setValueCheckbox] = useState('');




 

const handleCheckboxOne = () => {
  setChecked1((prevChecked) => !prevChecked);
  handleCheckboxValue(!isChecked1 ? 'checked' : 'unchecked');
};

const handleCheckboxTwo = () => {
  setChecked2((prevChecked) => !prevChecked);
  handleCheckboxValue(!isChecked2 ? 'checked' : 'unchecked');
};

const handleCheckboxValue = (newValue) => {
  setValueCheckbox(newValue)
  Alert.alert(newValue)
}



  console.log(valueCheckbox)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Work Allocation</Text>
        <Text style={styles.dateText}>Current Date: {currentDate}</Text>

        {/* Input Fields with Checkboxes */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked1}
            onValueChange={() => handleCheckboxOne()}
          />
          <Text style={styles.checkboxLabel}>Allocated</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked2}
            onValueChange={() => handleCheckboxTwo()}
          />
          <Text style={styles.checkboxLabel}>Not Allocated</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    margin: 7,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    width: 52,
  },
  backButtonText: {
    fontWeight: '700',
    color: '#fff',
  },
  contentContainer: {
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default WorkAllocation;
