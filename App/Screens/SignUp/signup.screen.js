import React from "react";
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const SignUpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title} variant="displayLarge">
          Squad
        </Text>
        <View style={styles.textInput}>
          <TextInput
            label="University Email"
            keyboardType="email-address"
          ></TextInput>
          <TextInput label="Full Name" keyboardType="name"></TextInput>
          <TextInput label="Username" keyboardType="name"></TextInput>
          <TextInput label="Password" secureTextEntry={true}></TextInput>
          <TextInput
            label="Confirm Password"
            secureTextEntry={true}
          ></TextInput>
        </View>

        <Button style={styles.forgotEmail} uppercase={false}>
          Forgot Email/Password
        </Button>
        <Button style={styles.loginButton} mode="contained">
          Login
        </Button>
      </SafeAreaView>
      <SafeAreaView style={styles.signUp}>
        <Text variant="bodySmall">Have an account already?</Text>
        <Button onPress={() => navigation.goBack()} uppercase={false}>
          Log in
        </Button>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },

  title: {
    textAlign: "center",
    paddingTop: 100,
    paddingBottom: 50,
  },

  textInput: {
    paddingBottom: 10,
    color: "red",
  },

  forgotEmail: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 25,
  },

  loginButton: {
    marginBottom: 30,
  },

  signUp: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
