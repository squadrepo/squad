import React, { useState } from "react";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const EmailChange = ({ navigation }) => {
  const done = () => {
    console.log({ uniEmail });
    navigation.navigate("Settings");
  };

  const [uniEmail, setUniEmail] = useState("");

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Change University Email" />
        <Button textDecoration="underline" onPress={done}>
          Done
        </Button>
      </Appbar.Header>
      <View>
        <TextInput
          label="Change University Email"
          keyboardType="email-address"
          onChangeText={(text) => setUniEmail(text)}
        ></TextInput>
      </View>
    </View>
  );
};
