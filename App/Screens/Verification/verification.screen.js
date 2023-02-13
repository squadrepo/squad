/*
Verification screen is largely unfinished
Things needed to be done for verification screen to be complete:
-Setting up single character input (Maybe only digits?) 
and having it come back as a code to verify with the backend
(There are availble resources for the above task ^^)
-Playing with the flexbox a bit to have the buttons 
at the bottom of the screen 
-Having working buttons or at least setting them up for the backend
-Back button that goes back to login/sign up screen
-Add space between buttons
-Code cleanup
*/

import * as React from "react";
import { BackHandler } from 'react-native';
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const VerificationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        
        <Text style={styles.title}>
          <b>Account Verification</b>
        </Text>
        <Text style={styles.subtitle}>
          Please denter the code sent to
        </Text>
        <Text style={styles.subtitle}>
          <b>...@drexel.edu</b> 
        </Text>

        <View style={styles.input}>
          <TextInput style={styles.inputSquare}></TextInput>
          <TextInput style={styles.inputSquare}></TextInput>
          <TextInput style={styles.inputSquare}></TextInput>
          <TextInput style={styles.inputSquare}></TextInput>
          <TextInput style={styles.inputSquare}></TextInput>
          <TextInput style={styles.inputSquare}></TextInput>
        </View>

        <View style={styles.buttons}>
          <Button style={styles.loginButton} mode="contained">
            Resend
          </Button>
          <Button style={styles.loginButton} mode="contained">
            Confirm
          </Button>
        </View>
        
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: "column",
    flex: 1,
  },

  title: {
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    paddingBottom: 30,
  },

  input: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 100,
  },

  inputSquare: {
    borderColor: "grey",
    borderWidth: 2,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  loginButton: {
    flex: 1,
    marginBottom: 30,
  },

});
