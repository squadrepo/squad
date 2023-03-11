import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, } from "react-native";
import { useRoute } from "@react-navigation/core";
import { Auth } from "@aws-amplify/auth";
import axios from "axios";

export const ProfileEditScreen = ({ navigation }) => {

  const UUID = getUserUUID();
  const url = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/editprofile";
  const updateData = {
    "uid": JSON.stringify(UUID),
    "username": "ed584",
    "aboutMe": "test",
    "tags": [
      "tester",
      "35"
    ],
    "pfpUrl": "something"
  };

  async function getUserUUID() {
    try {
      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();

      // Get the user's UUID
      const userUUID = currentUser.attributes.sub;

      console.log("User UUID:", userUUID);
      console.log("Full Name:", currentUser.attributes.name)

      return userUUID;
    } catch (error) {
      console.log("Error getting user UUID:", error);
      throw error;
    }
  }

  //{"uid":"123", "username":"GG466", "aboutMe":"Me Love Squad", "tags":["JOJO", "apple sucks"], "pfpUrl":"too prett for a URL"}
  const updateProfile = async () => {
    try {
      const response = await axios.post(url, updateData);
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


  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");

  const save = () => {
    //route.params.setUsername({ username });
    //route.params.setBio({ bio });
    updateProfile();
    navigation.navigate("Profile");
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
              <Text style={styles.textInput} label="Full Name" onPress={() => console.log("pressed")}>
                  Current First Last Name
              </Text>
      
              <Text style={styles.textHeader}>Username</Text>
              <Text style={styles.textInput} label="Username" onPress={() => navigation.navigate("Username", {
                  username: username,
                  setUsername: setUsername,
              })}>
                  Current username
              </Text>

              <Text style={styles.textHeader}>About Me</Text>
              <Text style={styles.textInput} numberOfLines={1} label="About Me" onPress={() => navigation.navigate("Bio", {
                  bio: bio,
                  setBio: setBio,
              })}>
                  This is the about me section where you 
                  would write about yourself and stuff and yeah there's a text limit. 
                  Just testing how far this desc can go and how natural it looks. It
                  could use a bit more testing though
              </Text>
          </View>

      <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>

      <View style={styles.tagList}>

          <Text style={styles.categoryText}>Tutoring</Text>
          <View style={styles.tagCategory}>
          
          <Tag tag={{ name:"Physics" }}/>
          <Tag tag={{ name:"Chemistry" }}/>

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
