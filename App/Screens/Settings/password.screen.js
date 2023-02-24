import React, { useState } from "react";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const Password = ({ navigation }) => {
  const done = () => {
    console.log({ oldPassword });
    console.log({ newPassword });
    console.log({ newPasswordAgain });
    navigation.navigate("Settings");
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Password" />
        <Button textDecoration="underline" onPress={done}>
          Done
        </Button>
      </Appbar.Header>
      <View>
        <TextInput
          label="Current password"
          secureTextEntry={true}
          onChangeText={(text) => setOldPassword(text)}
        ></TextInput>
        <TextInput
          label="New password"
          secureTextEntry={true}
          onChangeText={(text) => setNewPassword(text)}
        ></TextInput>
        <TextInput
          label="New password again"
          secureTextEntry={true}
          onChangeText={(text) => setNewPasswordAgain(text)}
        ></TextInput>
      </View>
    </View>
  );
};
