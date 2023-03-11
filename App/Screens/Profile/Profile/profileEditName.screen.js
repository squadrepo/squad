import React, { useState } from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput} from "react-native";
import { useRoute } from "@react-navigation/core";

export const ProfileEditNameScreen = ({ navigation }) => {

  return (

    <View>

      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Name" />
        <Button textDecoration="underline">Save</Button>
      </Appbar.Header>

    <SafeAreaView style={styles.container}>
      
      <View style={styles.profileDetail}>
        <Text style={styles.textHeader}>Name</Text>
        <TextInput style={styles.textInput} mode="text" label="Name" onChangeText={(text) => setName(text)}></TextInput>
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
