/*
Bugs/Things to fix/TO-DO:

Modify text on screens evan worked on with react native paper typography
*/

import React, { Component, useContext, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import axios from 'axios';

export const ProfileScreen = ({ navigation }) => {

  const {
    aboutMe,
    setAboutMe,
    fullName,
    pfpUrl,
    setPfpUrl,
    tags,
    setTags,
    setUid,
    username,
    setUsername
  } = React.useContext(UserContext);

  //URL used to GET users info
  const getUrl =
    'https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=';

  async function getUserUUID() {
    try {
      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();
      // Get the user's UUID
      const userUUID = currentUser.attributes.sub;

      return userUUID;
    } catch (error) {
      console.log('Error getting user UUID:', error);
      throw error;
    }
  }

  //This will get the users information and store the info in the correct states
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const UUID = await getUserUUID();
        setUid(UUID);

        // GET request for user info
        axios.get(`${getUrl}${UUID}`).then((response) => {
          //set user states
          setAboutMe(response.data.aboutMe);
          setPfpUrl(response.data.pfpUrl);
          setTags(response.data.tags);
          setUsername(response.data.username);
        });
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };
    getUser();
  }, []);

  return (
    
    <View>

      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("HomeFeed")} />
        <Appbar.Content title={fullName}/>
        <Button icon="account-settings" onPress={() => navigation.navigate("Settings")}>Settings</Button>
      </Appbar.Header>

    <SafeAreaView style={styles.container}>
      
      <View style={styles.profileHeader}>
        <View style={styles.left}>
          <View>
            <Text 
              numberOfLines={1} 
              adjustsFontSizeToFit={true}
              style={styles.name}>{fullName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>

          <View style={styles.edit}>
            <Button mode="outlined" style={{minWidth: 160}} onPress={() => navigation.navigate("EditProfile")}>
             Edit Profile
            </Button>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={pfpUrl && {uri: pfpUrl}}/>
          </View>
        </View>
      
      </View>

      <View style={styles.profileDesc}>
        <Text>{aboutMe}</Text>
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
    padding: 24,
    backgroundColor: "white",
  },

  profileHeader: {
    flexDirection: "row",
    justifyContent: "center",
  },

  left: {
    alignSelf: "center",
    alignItems: "center",
    width: 135
  },

  name: {
    fontWeight: "600",
    fontSize: 20,
  },

  username: {
    fontWeight: '300',
    color: "grey",
    fontSize: 14
  },

  edit: {
    padding: 10,
    paddingLeft: 20
  },

  right: {
    alignSelf: "center",
    alignItems: "center",
    padding: 10,
  },

  profilePicContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
  },

  profilePic: {
    width: 180,
    height: 180,
    borderRadius: 180/2,
  },

  circle: {
    width: 180, 
    height: 180, 
    borderRadius: 180/2, 
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
