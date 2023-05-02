/*
Bugs/Things to fix/TO-DO:
Add edit functionality for tags a bit
Fix issues with uploading pfp to s3 bucket
Change Boxes to pressable so a line isn't needed for onclick/onpress stuff
*/

import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { UserContext } from '../../Context';
import axios from "axios";

export const ProfileEditScreen = ({ navigation, route }) => {

  const {
    aboutMe,
    username,
    fullName,
    pfpUrl,
    tags,
    uid,
  } = React.useContext(UserContext);

  //URL used to POST users info
  const url = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/editprofile";
  const updateData = {
    "uid": uid,
    "username": username,
    "aboutMe": aboutMe,
    "tags": Array.from(tags),
    "pfpUrl": pfpUrl
  };

  const uploadPfp = async () => {
    const s3url = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/squad-app-s3";
    let localUri = route.params?.pfpUrl;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append('photo', { uri: localUri, name: filename, type });

    await axios.put(s3url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => {
          console.log(res.status)
      }).catch(err => {
          //console.log(err.response);
      });
    }

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
    //temp method to make it look like the image changed, will need to fix
    updateData["pfpUrl"] = route.params?.pfpUrl;
    updateProfile();
    navigation.navigate("Profile");
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

  //fix this
  function getPfpUrl() {
    if (route.params?.pfpUrl) {
      uploadPfp();
      updateData["pfpUrl"] = "https://squad-app-s3.s3.amazonaws.com/" + route.params?.pfpUrl.split('/').pop();
      return route.params?.pfpUrl;
    } else {
      return updateData["pfpUrl"];
    }
  }

  return (

    <View>

    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Profile" />
        <Button textDecoration="underline" onPress={save}>Save</Button>
    </Appbar.Header>

    <View style={styles.changePhoto}>

        <View style={styles.profilePicContainer}>
          <Image style={styles.profilePic} source={{uri: getPfpUrl()}}/>
          <Button title="Change Photo" onPress={() => navigation.navigate("ProfilePicturePicker", {
            currentUsername: getUsername(), 
            currentBio: getBio(), 
            currentTags: getTags(), 
            currentPfpUrl: getPfpUrl(),
          })}>Change Photo</Button>
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
