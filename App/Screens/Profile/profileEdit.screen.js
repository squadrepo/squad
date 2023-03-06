/*
Bugs/Things to fix/TO-DO:
While users can edit username and about me,
if they make changes to username, save, then make changes to
about me, then save, it does not save the changes to username.
Basically, users can only update one thing at a time.
Also updating multiple times in the same session will cause the
old data to fill the update data instead of the new shit
*/

import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput } from "react-native";
import { useRoute } from "@react-navigation/core";
import { UserContext } from '../../Context';
import { Auth } from "@aws-amplify/auth";
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
    "pfpUrl": "something"
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
    navigation.navigate("Profile");
  }
  

  function getUsername() {
    if (route.params?.username) {
      updateData["username"] = route.params?.username;
      console.log(updateData["username"])
      return route.params?.username;
    } else {
      updateData["username"] = username;
      return username;
    }
  }

  function getBio() {
    if (route.params?.aboutMe) {
      updateData["aboutMe"] = route.params?.aboutMe;
      return route.params?.aboutMe;
    } else {
      updateData["aboutMe"] = aboutMe;
      return aboutMe;
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

          <View style={styles.profilePic}>
              <Image></Image>
              <View style={styles.circle}></View>
              <Button title="Change Photo">Change Photo</Button>
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
              })}>
                  {getUsername()}
              </Text>

              <Text style={styles.textHeader}>About Me</Text>
              <Text style={styles.textInput} multiline={true} label="About Me" onPress={() => navigation.navigate("Bio", {
                  currentBio: getBio(),
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

  profilePic: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
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
