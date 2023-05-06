/*
Let users add lines when entering instead of closing keyboard
Add HelperText from React Native Paper for screen
*/

import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput} from "react-native";
import { useRoute } from "@react-navigation/core";
import { sub } from "react-native-reanimated";

export const CreateTutorProfileBio = ({ navigation, route }) => {
  const [bio, setBio] = React.useState(route.params.bio);
  const [availability] = React.useState(route.params.availability);
  const [hrRate] = React.useState(route.params.hrRate);
  const [subjects] = React.useState(route.params.subjects);
  const [classesTaken] = React.useState(route.params.classesTaken);
  const [pfpUrl] = React.useState(route.params.pfpUrl);

  const save = () => {
    navigation.navigate("CreateTutorProfile", 
    { 
      bio: bio, 
      availability: availability,
      hrRate: hrRate,
      subjects: subjects,
      classesTaken: classesTaken,
      pfpUrl: pfpUrl,
    });
  }

  return (

    <View>

      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Bio" />
        <Button textDecoration="underline" onPress={save}>Save</Button>
      </Appbar.Header>

    <SafeAreaView style={styles.container}>

      <View style={styles.profileDetail}>
        <Text style={styles.textHeader}>About me</Text>
        <TextInput style={styles.textInput} value={bio} mode="text" label="Bio" multiline={true} onChangeText={setBio}></TextInput>
      </View>

    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },

  profileDetail: {
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
    fontSize: 30,
  },

  textInput: {
    borderBottomColor: 'black', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
    fontSize: 16,
  },
});