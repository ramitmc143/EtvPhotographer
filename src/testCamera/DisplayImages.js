import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DisplayImages = () => {
  const [storedImages, setStoredImages] = useState([]);
  console.log()
  useEffect(() => {
    fetchStoredImages();
  }, []);
  const fetchStoredImages = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const images = await AsyncStorage.multiGet(keys);
      setStoredImages(images);
    } catch (error) {
      console.log('Error fetching stored images:', error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {storedImages.map(([id, uri]) => (
        <View key={id} style={styles.imageContainer}>
          <Image source={{uri}} style={styles.image} />
          <Text style={styles.imageText}>ID: {id}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    
    padding: 10,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageText: {
    fontSize: 18,
    
  },
});
export default DisplayImages;
