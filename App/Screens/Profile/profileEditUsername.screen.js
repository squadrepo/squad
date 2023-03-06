import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput} from "react-native";
import { useRoute } from "@react-navigation/core";

export const ProfileEditUsernameScreen = ({ navigation, route }) => {
  const [currentUsername, setCurrentUsername] = React.useState(route.params.currentUsername);

  const save = () => {
    navigation.navigate("EditProfile", { username: currentUsername});
  }

  return (

    <View>

      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Username" />
        <Button textDecoration="underline" onPress={save}>Save</Button>
      </Appbar.Header>
    
    <SafeAreaView style={styles.container}>

      <View style={styles.profileDetail}>
        <Text style={styles.textHeader}>Username</Text>
        <TextInput style={styles.textInput} value={currentUsername} mode="text" label="Username" onChangeText={setCurrentUsername}></TextInput>
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

