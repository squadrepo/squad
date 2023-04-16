import React, { useContext, useEffect, useState } from 'react';
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";
import MapView from 'react-native-maps';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import * as Location from 'expo-location';

export const FoodFeed = () => {
  const [location, setLocation] = useState();
  const [initialRegion, setInitialRegion] = useState(null)

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");   // TO-DO Set default location 
        return;
      }
    }
  
    const getCurrentPosition = async() => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      return currentLocation
    }
    const getMapData = async () => {
      try {
        const currentPosition = await getCurrentPosition(); // get the current position of the user
        const coords = currentPosition.coords
        
        setInitialRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922, // default values
          longitudeDelta: 0.0421,
        })

        // console.log(`${BASE_API_URL}/foodEvent?coords=${coords.latitude},${coords.longitude}&radius=5`)
        // const response = await axios.get(`${BASE_API_URL}/foodEvent?coords=${coords.latitude},${coords.longitude}&radius=5`);
        // console.log(response.data)

      } catch (error) {
        console.log(error);
      }
    };
    getPermissions()
    getMapData()
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
