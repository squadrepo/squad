import React from "react";
import {
  TextInput,
  Button,
  Text,
  Appbar,
  Menu,
  Divider,
  IconButton,
  List,
  Switch,
} from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";

export const Settings = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

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
          onPress={() => navigation.navigate("Password")}
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
          onPress={() => navigation.navigate("Dob")}
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Change University Email" />
        <IconButton
          icon="dots-horizontal"
          onPress={() => navigation.navigate("EmailChange")}
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
