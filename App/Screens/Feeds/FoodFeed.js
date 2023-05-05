import React, { useContext, useEffect, useState } from 'react';
import { TextInput, Button, Text, Modal, Portal } from "react-native-paper";
import { SafeAreaView, View, StyleSheet, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView, {Marker, PROVIDER_GOOGLE, Callout, MarkerAnimated} from 'react-native-maps';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import * as Location from 'expo-location';
import { FoodPostScreen } from '../Food/foodPost.screen';
import { getStringDateTimeFromUnix } from '../../utilities';


export const FoodFeed = () => {
  const Stack = createNativeStackNavigator();

  const FoodMap = ({navigation}) => {
    const [location, setLocation] = useState();
    const [initialRegion, setInitialRegion] = useState(null)
    const [visible, setVisible] = useState(false);
    const [radius, setRadius] = useState(1);
    const [markers, setMarkers] = useState(null); 
    const [granted, setGranted] = useState(false);
    const [lat, setLat] = useState(39.95380477768779)
    const [long, setLong] = useState(-75.18490433692932)

    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setInitialRegion({
          latitude: lat,                 //coordinates for Drexel University
          longitude: long, 
          latitudeDelta: 0.0922,                      // default values
          longitudeDelta: 0.0421,
        })
        console.log("Please grant location permissions");   
        return;
      } else {
        setGranted(true);
      }

    }

    const getCurrentPosition = async() => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      return currentLocation
    }

    useEffect(() => {
    
      const getMapData = async () => {
        if (granted) {
          const currentPosition = await getCurrentPosition(); // get the current position of the user
          coords = currentPosition.coords; 
          
          setLat(coords.latitude)
          setLong(coords.longitude)

          setInitialRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0922, // default values
            longitudeDelta: 0.0421,
          })

        }
        try {
          const response = await axios.get(`${BASE_API_URL}/foodEvent?coords=${lat},${long}&radius=${radius}`);
          const filteredResponse = response.data.map(({ hashKey, rangeKey, geoJson, eventName, desc, address, startEndTimestamp }) => 
          ({hashKey: hashKey,
            rangeKey: rangeKey,
            startEndTimestamp: startEndTimestamp,
            title: eventName,
            description: desc,
            address: address,   
            coordinates : 
            { latitude: parseFloat(geoJson.split(',')[0]),
              longitude: parseFloat(geoJson.split(',')[1]),
            }}));
          setMarkers(filteredResponse)

        } catch (error) {
          console.log(error);
        }
      };
      getPermissions()
      getMapData()

    }, [radius, granted, lat, long]);

    const onButtonPress = () => {
      console.log('Marker button pressed');
    };

    const applyFilter = () => {
      const filterRadius = radius === '' ? '1' : radius;
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
              <Callout onPress={() => navigation.navigate('FoodPostScreen', {hashKey: marker.hashKey, rangeKey: marker.rangeKey, root: 'FoodMap'})}>
                  <Text variant='labelLarge' style={{margin:2}}>{marker.title}</Text>
                  <Text style={{margin:2}}>Address: {marker.address}</Text>
                  <Text style={{margin:2}}>Ends: {getStringDateTimeFromUnix(marker.startEndTimestamp[1])}</Text>
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
              <Text style={{margin:10, fontWeight:'bold'}}>Please wait for a 20 seconds for the request to be complete...</Text>
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

  return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FoodMap" component={FoodMap} />
    <Stack.Screen name="FoodPostScreen" component={FoodPostScreen} />
  </Stack.Navigator>
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
