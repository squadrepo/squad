/*
Let users add lines when entering instead of closing keyboard
Add HelperText from React Native Paper for screen
*/

import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput, Pressable, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/core";
import { FlatList } from "react-native-gesture-handler";

export const CreateTutorProfileSubjects = ({ navigation, route }) => {
  const [bio] = React.useState(route.params.bio);
  const [availability] = React.useState(route.params.availability);
  const [hrRate] = React.useState(route.params.hrRate);
  const [subjects, setSubjects] = React.useState(route.params.subjects);
  const [classesTaken] = React.useState(route.params.classesTaken);
  const [pfpUrl] = React.useState(route.params.pfpUrl);
  const classSubjects = ["Mathematics","Statistics","Computer Science","Data Science","Physics","Chemistry","Biology","Environmental Science","Geology","Geography","Psychology","Sociology","Anthropology","Philosophy","History","Political Science","Economics","Business","Marketing","Management","Finance","Accounting","Education","English","Creative Writing","Journalism","Communication","Film Studies","Media Studies","Graphic Design","Fine Arts","Music","Theater","Dance","Foreign Languages"];

  function addSubject(subject) {
    setSubjects(subjects.push(subject));
    console.log(subjects);
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

    <View style={{flex:1}}>

      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Subjects"/>
      </Appbar.Header>


    <SafeAreaView style={styles.container}>

      <FlatList
        data = {classSubjects}
        renderItem= { (element)  => {
          return (
            <Pressable onPress={() => addSubject(element.item)}>
              <View style={styles.listItem}>
                <Text style={styles.itemText}>
                  {element.item}
                </Text>
              </View>
            </Pressable>
          )
        }}/>

    </SafeAreaView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },

  list: {

  },

  listItem: {
    height: 50,
    borderColor: "black",
    borderWidth: 2
  },

  itemText: {
    fontSize: 30,
    paddingTop: 5,
    alignSelf: "center",
    justifyContent: "center",
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