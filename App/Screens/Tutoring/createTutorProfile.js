/*
Bugs/Things to fix/TO-DO:

Modify text on screens evan worked on with react native paper typography
*/

/*
Other to do
-Add functionality for camera
-Fix things for changing bio
--Related screen
--Fixing code when it comes to dealing with params
-Add functionality for availability times
-Add functionality for adding subject
-Add functionality for adding courses taken
*/

import React, { Component, useContext, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text, } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import axios from 'axios';


export const CreateTutorProfile = ({ navigation, route }) => {

  const {
    fullName,
    pfpUrl,
    setPfpUrl,
    uid,
    setUid
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
          setPfpUrl(response.data.pfpUrl);
        });
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };
    getUser();
  }, []);

  const testData = {
    "uid": 
  }

  return (
    <View>

    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Create/Edit Tutor Profile" />
      <Button textDecoration="underline" onPress={() => console.log("pressed")}>Save</Button>
    </Appbar.Header>

    <View style={styles.changePhoto}>

      <View style={styles.profilePicContainer}>
        <Image style={styles.profilePic} source={pfpUrl ? {uri: pfpUrl} : <View style={styles.circle}></View>}/>
        <Button title="Change Photo">Change Photo</Button>
      </View>


    </View>

    <SafeAreaView style={styles.container}>

      <View style={styles.profileDetails}>
        <Text style={styles.textHeader}>Name</Text>
        <Text style={styles.textInputName} label="Full Name">
                {fullName}
        </Text>

        <Text style={styles.textHeader}>About Me</Text>
          <Text style={styles.textInput} multiline={true} label="About Me">
            Temp Text to test stuff {'\n'}
            asdas {'\n'}
            dasdasd
          </Text>

        <Text style={styles.textHeader}>Availability</Text>
          <Text style={styles.timeInput} multiline={true} label="Availability">
            Sun   Add a time... {'\n'}
            Mon   Add a time... {'\n'}
            Tue   Add a time... {'\n'}
            Wed   Add a time... {'\n'}
            Thu   Add a time... {'\n'}
            Fri   Add a time... {'\n'}
            Sat   Add a time... {'\n'}
          </Text>
      </View>

    <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>
    
    <View style={styles.tagList}>

      <Text style={styles.categoryText}>Subjects</Text>
      <View style={styles.tagCategory}>

        <Tag tag={{ name:"Mathematics" }}/>
        <Tag tag={{ name:"Computer Science" }}/>
        <Tag tag={{ name:"Fine Arts" }}/>

      </View>

      <Text style={styles.categoryText}>Courses Taken</Text>
      <View style={styles.tagCategory}>

        <Tag tag={{ name:"MATH 123" }}/>
        <Tag tag={{ name:"CS 333" }}/>
        <Tag tag={{ name:"ABC 123" }}/>

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

  timeInput: {
    borderBottomColor: 'black', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
    paddingLeft: 45,
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
