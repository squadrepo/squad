import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput} from "react-native";
import { useRoute } from "@react-navigation/core";

export const ProfileEditBioScreen = ({ navigation, route }) => {
  const [bio, setBio] = useState(route.params.bio);

  const save = () => {
    route.params.setBio({ bio });
    navigation.navigate("EditProfile");
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
        <TextInput style={styles.textInput} mode="text" label="Bio" onChangeText={(text) => setBio(text)}></TextInput>
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