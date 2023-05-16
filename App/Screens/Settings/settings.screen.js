// TODO:
// UnivExcl does not save upon post request

import React, { useState, useEffect, useContext } from "react";
import { Button, Appbar, Menu, IconButton, Switch } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { UserContext } from "../../Context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getDateFromUnix } from "../../utilities";

export const Settings = ({ navigation }) => {
  const { uid, password, dobNum, setDobNum, email, univExclExp } =
    useContext(UserContext);

  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(univExclExp);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickedDate, setPickedDate] = useState(getDateFromUnix(dobNum));

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setPickedDate(date);
    hideDatePicker();
  };

  const baseUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/editSettings";

  const saveSettings = async (event) => {
    try {
      const newDobNum = Math.floor(pickedDate.getTime() / 1000);
      const body = {
        uid: uid,
        dob: newDobNum,
        email: email,
        univExclExp: isSwitchOn,
        password: passwordChanged ? password : undefined
      };
      console.log(body);
      const response = await axios.post(baseUrl, body);
      setDobNum(newDobNum);
      console.log(response.status);
      alert("Settings saved successfuly.");
    } catch (error) {
      alert("An error has occurred");
      if (error.response === undefined) throw error;
      const { response } = error;
      console.log(`${response.status}:`, response.data);
    }
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Main')} />
        <Appbar.Content title="Settings" />
        <Button textDecoration="underline" onPress={saveSettings}>
          Save
        </Button>
      </Appbar.Header>
      <View style={styles.options}>
        <Menu.Item title="Password" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate("Password", {
              passwordChanged,
              setPasswordChanged
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
          onPress={() => setDatePickerVisibility(true)}
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Change University Email" />
        <IconButton
          icon="dots-horizontal"
          onPress={() => navigation.navigate("EmailChange")}
        />
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={pickedDate}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        backdropStyleIOS={{ backgroundColor: "#674fa5" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10
  },
  toggle: {
    paddingRight: 10
  }
});
