import * as React from "react";
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title} variant="displayLarge">
          Squad
        </Text>
        <View style={styles.textInput}>
          <TextInput label="Email" keyboardType="email-address"></TextInput>
          <TextInput label="Password" secureTextEntry={true}></TextInput>
        </View>

        <Button style={styles.forgotEmail} uppercase={false}>
          Forgot Email/Password
        </Button>
        <Button style={styles.loginButton} mode="contained">
          Login
        </Button>
      </SafeAreaView>
      <SafeAreaView style={styles.signUp}>
        <Text variant="bodySmall">Dont have an account?</Text>
        <Button
          title="Sign Up."
          onPress={() => navigation.navigate("SignUp")}
          uppercase={false}
        >
          Sign up.
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
    paddingBottom: 100,
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
