import React, { useState } from "react";
import { View, StyleSheet, Image, Text, picker } from "react-native";
import { Button, Appbar, Switch, Menu, DatePicker } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateFromUnix } from "../../utilities";
import { TextInput } from "react-native-paper";

export const CreateEvent = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [time, setTime] = useState("9:00AM");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  const handleTagsChange = (text) => {
    const newTags = text
      .split(",")
      .map((tag) => tag.trim().replace(/!+$/, ""))
      .filter((tag) => tag !== "");
    setTags(newTags);
    console.log(newTags);
  };

  const handleDateChange = (value) => {
    setDate(value);
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      setDateError("Please enter a date in the format MM/DD/YYYY");
    } else {
      setDateError("");
    }
  };

  const handleDurationChange = (value) => {
    const intValue = parseInt(value, 10);
    if (intValue >= 1 && intValue <= 12) {
      setDuration(intValue.toString());
    } else {
      setDuration("");
    }
  };

  const validateTime = (input) => {
    // Regular expression to match time in format hh:mmAM or hh:mmPM
    const timeRegex = /^(0?[1-9]|1[012]):[0-5][0-9][AP][M]$/;
    return timeRegex.test(input);
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Drawers")} />
        <Appbar.Content title="Create Event" />
        <Button
          onPress={() => {
            sendFirstMessage(uid, users);
            console.log(uid);
            console.log(users);
          }}
        >
          save
        </Button>
      </Appbar.Header>

      <View style={styles.changePhoto}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{
              uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.visitphilly.com%2Fthings-to-do%2Fattractions%2Flove-statue%2F&psig=AOvVaw2Pqn-4e8kwOX8ix2eTLoFb&ust=1681058130983000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCICMk9jbmv4CFQAAAAAdAAAAABAE"
            }}
          />
          <Button
            title="Change Photo"
            onPress={() =>
              navigation.navigate("ProfilePicturePicker", {
                currentUsername: getUsername(),
                currentBio: getBio(),
                currentTags: getTags(),
                currentPfpUrl: getPfpUrl()
              })
            }
          >
            Upload photo for event
          </Button>
        </View>
      </View>
      <TextInput
        label="Date"
        value={date}
        onChangeText={handleDateChange}
        error={dateError}
      />
      <TextInput
        label="Time"
        value={time}
        onChangeText={(text) => setTime(text)}
        error={!validateTime(time)}
      />
      {!validateTime(time) && (
        <Text style={{ color: "red" }}>
          Please enter a valid time (hh:mmAM or hh:mmPM)
        </Text>
      )}
      <TextInput
        label="Duration (hours)"
        value={duration}
        onChangeText={handleDurationChange}
        keyboardType="numeric"
      ></TextInput>
      <TextInput
        label="Description"
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={styles.input}
      />
      <TextInput
        label="Tags(Comma separated)"
        onChangeText={handleTagsChange}
      ></TextInput>
      <View style={styles.options}>
        <Menu.Item title="University Exclusive" />
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white"
  },

  changePhoto: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "lightgrey"
  },

  profilePicContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180
  },

  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  },

  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10
  },
  toggle: {
    paddingRight: 10
  }
});
