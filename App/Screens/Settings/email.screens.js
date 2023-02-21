import * as React from "react";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const EmailChange = ({ navigation }) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Change University Email" />
        <Button textDecoration="underline">Done</Button>
      </Appbar.Header>
      <View>
        <TextInput
          label="Change University Email"
          keyboardType="email-address"
        ></TextInput>
      </View>
    </View>
  );
};
