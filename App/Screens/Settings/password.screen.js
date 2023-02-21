import * as React from "react";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const Password = ({ navigation }) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Password" />
        <Button textDecoration="underline">Done</Button>
      </Appbar.Header>
      <View>
        <TextInput label="Current password" secureTextEntry={true}></TextInput>
        <TextInput label="New password" secureTextEntry={true}></TextInput>
        <TextInput
          label="New password again"
          secureTextEntry={true}
        ></TextInput>
      </View>
    </View>
  );
};
