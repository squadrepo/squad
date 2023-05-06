import React, { useState } from "react";
import { Button, Appbar } from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput, Pressable, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/core";
import { FlatList } from "react-native-gesture-handler";

export const CreateTutorProfileCourses = ({ navigation, route }) => {
  const [bio] = React.useState(route.params.bio);
  const [availability] = React.useState(route.params.availability);
  const [hrRate] = React.useState(route.params.hrRate);
  const [subjects] = React.useState(route.params.subjects);
  const [classesTaken, setClassesTaken] = React.useState(route.params.classesTaken);
  const [pfpUrl] = React.useState(route.params.pfpUrl);
  const [currentCourse, setCurrentCourse] = React.useState("")

  function addCourse(course) {
    setClassesTaken(classesTaken.push(course));
    console.log(classesTaken);
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
        <Appbar.Content title="Add Course"/>
        <Button textDecoration="underline" onPress={() => addCourse(currentCourse)}>Save</Button>
      </Appbar.Header>

    <SafeAreaView style={styles.container}>

      <View style={styles.profileDetail}>
        <Text style={styles.textHeader}>Course</Text>
        <TextInput style={styles.textInput} value={currentCourse} mode="text" label="Bio" multiline={false} onChangeText={setCurrentCourse}></TextInput>
      </View>

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