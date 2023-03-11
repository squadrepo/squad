/*
Bugs/Things to fix/TO-DO:
Add edit functionality for tags a bit
Add camera functionality
*/

import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { UserContext } from '../../Context';
import axios from "axios";

export const ProfileEditScreen = ({ navigation, route }) => {

  const {
    aboutMe,
    setAboutMe,
    username,
    setUsername,
    fullName,
    pfpUrl,
    setPfpUrl,
    tags,
    setTags,
    uid,
  } = React.useContext(UserContext);

  //URL used to POST users info
  const url = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/editprofile";
  const updateData = {
    "uid": uid,
    "username": username,
    "aboutMe": aboutMe,
    "tags": Array.from(tags),
    "pfpUrl": "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png"
  };


  //{"uid":"123", "username":"GG466", "aboutMe":"Me Love Squad", "tags":["JOJO", "apple sucks"], "pfpUrl":"too prett for a URL"}
  const updateProfile = async () => {
  
    try {
      const response = await axios.post(url, updateData);
      console.log("User table: ", updateData);
      console.log("User table updated:", response.status);
    } catch (error) {
      alert("An error has occurred");

      if (error.response === undefined) {
        throw error;
      }
      const { response } = error;
      console.log(response.status);
      console.log(response.data);
    }
  };

 
  const save = () => {
    updateProfile();
    navigation.replace("Profile");
  }
  

  function getUsername() {
    if (route.params?.username) {
      updateData["username"] = route.params?.username;
      return updateData["username"];
    } else {
      return updateData["username"];
    }
  }

  function getBio() {
    if (route.params?.aboutMe) {
      updateData["aboutMe"] = route.params?.aboutMe;
      return updateData["aboutMe"];
    } else {
      return updateData["aboutMe"];
    }
  }

  function getTags() {
    if (route.params?.tags) {
      updateData["username"] = route.params?.tags;
      return updateData["tags"];
    } else {
      return updateData["tags"];
    }
  }

  function getPfpUrl() {
    if (route.params?.pfpUrl) {
      updateData["pfpUrl"] = route.params?.pfpUrl;
      return updateData["pfpUrl"];
    } else {
      return updateData["pfpUrl"];
    }
  }

  /*
  async function getPermission() {
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);
    //if (permission === 'denied') await Linking.openSettings();
  }
  */

  async function getPermission() {
    const cameraPermission = await Camera.getCameraPermissionStatus()
    const microphonePermission = await Camera.getMicrophonePermissionStatus()
  }
  //const devices = useCameraDevices();
  //const device = devices.back;


  return (

    <View>

    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Profile" />
        <Button textDecoration="underline" onPress={save}>Save</Button>
    </Appbar.Header>

    <View style={styles.changePhoto}>

        <View style={styles.profilePicContainer}>
          <Image style={styles.profilePic} source={{uri: pfpUrl}}/>
          <Button title="Change Photo" onPress={() => getPermission()}>Change Photo</Button>
        </View>

    </View>

    <SafeAreaView style={styles.container}>

        <View style={styles.profileDetails}>
            <Text style={styles.textHeader}>Name</Text>
            <Text style={styles.textInputName} label="Full Name">
                {fullName}
            </Text>
    
            <Text style={styles.textHeader}>Username</Text>
            <Text style={styles.textInput} label="Username" onPress={() => navigation.navigate("Username", {
                currentUsername: getUsername(), 
                currentBio: getBio(), 
                currentTags: getTags(), 
                currentPfpUrl: getPfpUrl(),
            })}>
                {getUsername()}
            </Text>

            <Text style={styles.textHeader}>About Me</Text>
            <Text style={styles.textInput} multiline={true} label="About Me" onPress={() => navigation.navigate("Bio", {
                currentUsername: getUsername(), 
                currentBio: getBio(), 
                currentTags: getTags(), 
                currentPfpUrl: getPfpUrl(),
            })}>
                {getBio()}
            </Text>
        </View>

    <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>

    <View style={styles.tagList}>

        <Text style={styles.categoryText}>Tutoring</Text>
        <View style={styles.tagCategory}>
        
        <Tag tag={{ name:Array.from(tags)[0] }}/>
        <Tag tag={{ name:Array.from(tags)[1] }}/>

        </View>

        <Text style={styles.categoryText}>Food</Text>
        <View style={styles.tagCategory}>

        <Tag tag={{ name:"Vegetarian" }}/>

        </View>

        <Text style={styles.categoryText}>Social</Text>
        <View style={styles.tagCategory}>
        
        <Tag tag={{ name:"Walking" }}/>
        <Tag tag={{ name:"Running" }}/>
        <Tag tag={{ name:"Food" }}/>
        <Tag tag={{ name:"Jogging" }}/>

        </View>

        <Text style={styles.categoryText}>Gig-work</Text>
        <View style={styles.tagCategory}>
        
        <Tag tag={{ name:"Groceries" }}/>

        </View>

    </View>
    </SafeAreaView>
    </View>
  );
};

const Tag = ({ tag }) => <View style={styles.tag}><Button mode="outlined" onPress={() => console.log('Pressed')}>#{tag.name}</Button></View>;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },

  changePhoto: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },

  profilePicContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
  },

  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100/2,
  },

  profileDetails: {
    padding: 10,
    paddingLeft: 15,
    alignSelf: 'flex-start',
    alignItems: "stretch",
    alignContent: "stretch",
  },

  textHeader: {
    fontWeight: '400', 
    color: "grey",
    paddingTop: 12,
    paddingBottom: 5,
  },

  textInput: {
    borderBottomColor: 'black', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
  },

  textInputName: {
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
  },

  circle: {
    width: 90, 
    height: 90, 
    borderRadius: 90/2, 
    backgroundColor: 'black',
  },

  profileDesc: {
    padding: 15,
  },

  tagList: {
    padding: 10,
    paddingLeft: 15,
    alignSelf: 'flex-start',
  },

  categoryText: {
    fontSize: 16, 
    paddingBottom: 8
  },

  tagCategory: {
    flexDirection: "row",
    paddingBottom: 5,
    flexWrap: "wrap",
  },

  tag: {
    paddingLeft: 2,
    paddingBottom: 5,
  },
});
