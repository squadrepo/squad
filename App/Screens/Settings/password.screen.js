import React, { useState } from "react";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/core";

export const Password = ({ navigation, route }) => {
  const [oldPwrd, setOldPwrd] = useState(route.params.oldPassword);
  const [newPwrd, setNewPwrd] = useState(route.params.newPassword);
  const [newPwrdAgain, setNewPwrdAgain] = useState(route.params.newPwrdAgain);

  const done = () => {
    route.params.setOldPassword({ oldPwrd });
    route.params.setNewPassword({ newPwrd });
    route.params.setNewPasswordAgain({ newPwrdAgain });
    navigation.navigate("Settings");
  };

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
          onChangeText={(text) => setOldPwrd(text)}
        ></TextInput>
        <TextInput
          label="New password"
          secureTextEntry={true}
          onChangeText={(text) => setNewPwrd(text)}
        ></TextInput>
        <TextInput
          label="New password again"
          secureTextEntry={true}
          onChangeText={(text) => setNewPwrdAgain(text)}
        ></TextInput>
      </View>
    </View>
  );
};
