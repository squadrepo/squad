import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Text,
  Appbar,
  Menu,
  IconButton,
  Switch,
} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, useRoute } from "react-native";

export const Settings = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [dob, setDOB] = useState("");
  const [uniEmail, setUniEmail] = useState("");

  useEffect(() => {
    console.log(oldPassword);
    console.log(newPassword);
    console.log(newPasswordAgain);
    console.log(isSwitchOn);
    console.log(dob);
    console.log(uniEmail);
    console.log(" ");
  }, [oldPassword, newPassword, newPasswordAgain, isSwitchOn, dob, uniEmail]);

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction />
        <Appbar.Content title="Settings" />
        <Button textDecoration="underline">Save</Button>
      </Appbar.Header>
      <View style={styles.options}>
        <Menu.Item title="Password" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate("Password", {
              oldPassword: oldPassword,
              newPassword: newPassword,
              newPasswordAgain: newPasswordAgain,
              setOldPassword: setOldPassword,
              setNewPassword: setNewPassword,
              setNewPasswordAgain: setNewPasswordAgain,
            })
          }
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="University Exclusive" />
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Date Of Birth" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate("Dob", {
              dob: dob,
              setDOB: setDOB,
            })
          }
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Change University Email" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate("EmailChange", {
              uniEmail: uniEmail,
              setUniEmail: setUniEmail,
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  toggle: {
    paddingRight: 10,
  },
});
