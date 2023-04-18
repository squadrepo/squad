import React, { useContext, useEffect, useState } from 'react';
import { TextInput, Button, Text, Modal, Portal } from "react-native-paper";
import { SafeAreaView, View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, Callout} from 'react-native-maps';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import * as Location from 'expo-location';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

export const FoodFeed = () => {
  const [location, setLocation] = useState();
  const [initialRegion, setInitialRegion] = useState(null)
  const [visible, setVisible] = useState(false);
  const [radius, setRadius] = useState(1);
  const [markers, setMarkers] = useState(null); 

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

        const response = await axios.get(`${BASE_API_URL}/foodEvent?coords=${coords.latitude},${coords.longitude}&radius=${radius}`);
        const filteredResponse = response.data.map(({ geoJson, eventName, desc, address }) => 
        ({title: eventName,
          description: desc,
          address: address,   
          coordinates : 
          { latitude: parseFloat(geoJson.split(',')[0]),
            longitude: parseFloat(geoJson.split(',')[1]),
          }}));
        setMarkers(filteredResponse)
        console.log(filteredResponse)

      } catch (error) {
        console.log(error);
      }
    };
    getPermissions()
    getMapData()
  }, [radius]);

  const onButtonPress = () => {
    console.log('Marker button pressed');
  };

  const applyFilter = () => {
    const filterRadius = radius === '' ? '1' : radius;
    // Apply the filter with the filterRadius value
    console.log('Applied filter with radius:', filterRadius);
    setVisible(true);
  };

  
  return (
    <View style={styles.container}>
    {initialRegion ? (
      <MapView style={styles.map} initialRegion={initialRegion} provider={PROVIDER_GOOGLE} >
        {markers &&
          markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinates}
              title={marker.title}
              description={marker.address}
            > 
            <Callout>
                <Text variant='labelLarge' style={{margin:2}}>{marker.title}</Text>
                <Text style={{margin:2}}>Address: {marker.address}</Text>
                <Button style={{margin:2}} mode="contained"> Show details </Button>
            </Callout>
            </Marker>
          ))}
      </MapView>
      
      
    ) : (
      <ActivityIndicator style={styles.activityIndicator} animating={true} size="large" />
    )}
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <View style={styles.modalContent}>
            
            <TextInput
              label="Radius (in miles)"
              keyboardType="numeric"
              value={radius.toString()}
              style={{ width: 300, margin: 10 }}
              onChangeText={(value) => {
                if (value === '') {
                  setRadius('');
                } else {
                  const parsedValue = parseFloat(value);
                  if (!isNaN(parsedValue)) {
                    setRadius(value);
                  }
                }
              }}
            />
            <Button mode="contained" onPress={() => setVisible(false)}>
              Apply
            </Button>
            <Text style={{margin:10}}>Please wait for a 10 seconds for the request to be complete...</Text>
          </View>
        </Modal>
      </Portal>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={applyFilter}
          style={styles.filterButton}
        >
          Filter
        </Button>
      </View>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  filterButton: {
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize:20
  }, 
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
  }})
