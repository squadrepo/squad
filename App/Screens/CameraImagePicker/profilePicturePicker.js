// Add more camera functionality

import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text, TouchableOpacity, Dimensions, } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { Camera, CameraType } from 'expo-camera';
import { UserContext } from '../../Context';
import axios from "axios";

export const ProfilePicturePicker = ({ navigation, route }) => {
  const [username] = React.useState(route.params.currentUsername);
  const [bio] = React.useState(route.params.currentBio);
  const [tags] = React.useState(route.params.currentTags);
  const [pfpUrl, setPfpUrl] = React.useState(route.params.currentPfpUrl);
  
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const save = () => {
    setPfpUrl(image);
    navigation.navigate("EditProfile", 
    { 
      username: username, 
      aboutMe: bio,
      tags: tags,
      pfpUrl: image
    });
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Grant Squad permission to use your camera?</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  const retakePicture = async () => {
    setImage(null);
  }

  function isCameraActiveHeader() {
    if (image == null) {
      return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Photo"/>
            {/* <Button textDecoration="underline" icon="check"></Button> */}
        </Appbar.Header> 
      );
    } else if (image) {
      return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => retakePicture()} />
            <Appbar.Content title=""/>
            <Button textDecoration="underline" icon="check" onPress={save}></Button>
        </Appbar.Header>
      );
    }
  }

  function isCameraActive() {
    if (image == null) {
      return (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} ref={ref => setCamera(ref)} type={type} ratio="1:1"/>
          <Button style={styles.flipCamera} labelStyle={{fontSize: 50}}icon="camera-switch" onPress={toggleCameraType}/>
          <TouchableOpacity style={styles.pictureButton} onPress={() => takePicture()}>
            <View style={styles.pictureButtonCenter}/>
          </TouchableOpacity>
        </View>
      )
    } else if (image) {
      return (
        <View style={styles.cameraContainer}>
          <Image source={{uri: image}} style={styles.photoBorder}/>
          <Image source={{uri: image}} style={styles.photo}/>
          
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>

        {isCameraActiveHeader()}
        {isCameraActive()}
        
      </SafeAreaView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cameraContainer: {
    flex: 1,
    flexDirection: 'column'
  },

  camera: {
    aspectRatio: 1,
    width: "100%",
  },

  flipCamera: {
    fontWeight: 'bold',
    color: 'black',
    alignSelf: "flex-start",
    marginTop: -70,
  },

  pictureButton: {
    backgroundColor: "lightgrey",
    width: 80,
    height: 80,
    borderRadius: 80/2,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 150,
  },

  pictureButtonCenter: {
    backgroundColor: "white", 
    width: 70, 
    height: 70, 
    borderRadius: 70/2,
    alignSelf: "center",
  },

  photoBorder: {
    opacity: 0.5,
    aspectRatio: 1,
    width: "100%",
  },

  photo: {
    position: "absolute",
    aspectRatio: 1,
    width: "100%",
    borderRadius: Dimensions.get('window').width / 2,
  },

});
