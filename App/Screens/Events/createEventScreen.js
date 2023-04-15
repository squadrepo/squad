import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import { Button, Appbar, Switch, Menu, DatePicker } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateFromUnix } from "../../utilities";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../../Context";
import axios from "axios";
import moment from "moment";

export const CreateEvent = ({ navigation }) => {
  //User context variable
  const { univ, uid } = useContext(UserContext);

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [time, setTime] = useState("9:00AM");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [image, setImage] = useState(
    "http://clipart-library.com/images/kcMKrBBXi.jpg"
  );

  const baseUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/beta/socialEvent/createsocialpost";

  const postEvent = async (event) => {
    try {
      const epochTime = moment(
        `1970-01-01T${time}:00`,
        "YYYY-MM-DDTHH:mm:ss"
      ).unix();

      //convert date to epoch
      const [month, day, year] = date.split("/");
      const epochDate = Date.UTC(year, month - 1, day) / 1000;

      const eventTimestamp = new Date(epochTime + epochDate).getTime() - 3600;

      console.log(eventTimestamp);

      const body = {
        univAssoc: univ,
        createTimestamp: "",
        bannerUrl: image,
        city: city,
        desc: description,
        eventName: title,
        eventTimestamp: eventTimestamp,
        posterUid: uid,
        state: state,
        streetAddress: address,
        tags: tags,
        univExcl: isSwitchOn,
        zip: zipCode
      };
      console.log(body);
      const response = await axios.post(baseUrl, body);
      alert("Event posted successfully.");
      navigation.navigate("Main");
    } catch (error) {
      alert("An error has occurred");
      if (error.response === undefined) throw error;
      const { response } = error;
      console.log(`${response.status}:`, response.data);
    }
  };

  const handleDonePress = () => {
    // Do something with the text input value
    console.log("submitted");
    Keyboard.dismiss();
  };

  {
    /*
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
*/
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      // Upload the image to S3 bucket
      const formData = new FormData();
      formData.append("file", {
        uri: result.uri,
        type: "image/jpeg",
        name: `event_${Date.now()}.jpg`
      });
      console.log(formData);

      const s3Url =
        "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/squad-app-s3/";
      const response = await axios.post(s3Url, formData);
      console.log(response.status);

      if (response.status === 200) {
        // Update the image state with the S3 URL
        const imageUrl = response.data.Location;
        setImage(imageUrl);
      }
    }
  };

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

  const stateHandler = (value) => {
    const cleanedText = value
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 2);
    console.log(cleanedText);
    setState(cleanedText);
  };

  const zipCodeHandler = (value) => {
    const limitedLengthText = value.replace(/[^0-9]/g, "").slice(0, 5);
    setZipCode(limitedLengthText);
  };

  const validateTime = (input) => {
    // Regular expression to match time in format hh:mmAM or hh:mmPM
    const timeRegex = /^(0?[1-9]|1[012]):[0-5][0-9][AP][M]$/;
    return timeRegex.test(input);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Drawers")} />
        <Appbar.Content title="Create Event" />
        <Button onPress={postEvent}>post</Button>
      </Appbar.Header>
      <ScrollView>
        <View style={styles.changePhoto}>
          <View style={styles.profilePicContainer}>
            <Image
              style={styles.profilePic}
              source={
                image
                  ? { uri: image }
                  : { uri: "http://clipart-library.com/images/kcMKrBBXi.jpg" }
              }
            />
          </View>
        </View>
        <Button title="Change Photo" onPress={pickImage}>
          Upload photo for event
        </Button>
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          returnKeyType="done"
        />
        <TextInput
          label="Date"
          value={date}
          onChangeText={handleDateChange}
          returnKeyType="done"
          error={dateError}
        />
        <TextInput
          label="Time"
          value={time}
          onChangeText={(text) => setTime(text)}
          returnKeyType="done"
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
          returnKeyType="done"
          keyboardType="numeric"
        ></TextInput>
        <TextInput
          label="Address"
          onChangeText={(text) => setAddress(text)}
          returnKeyType="done"
        ></TextInput>
        <TextInput
          label="City"
          onChangeText={(text) => setCity(text)}
          returnKeyType="done"
        ></TextInput>
        <TextInput
          label="State"
          value={state}
          onChangeText={stateHandler}
          returnKeyType="done"
        ></TextInput>
        <TextInput
          label="Zip Code"
          value={zipCode}
          onChangeText={zipCodeHandler}
          returnKeyType="done"
        ></TextInput>
        <TextInput
          label="Description"
          multiline={true}
          numberOfLines={5}
          maxLength={300}
          value={description}
          onChangeText={(text) => setDescription(text)}
          returnKeyType="done"
          onSubmitEditing={handleDonePress}
        />
        <TextInput
          label="Tags(Comma separated)"
          onChangeText={handleTagsChange}
          returnKeyType="done"
        ></TextInput>
        <View style={styles.options}>
          <Menu.Item title="University Exclusive" />
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180
  },

  profilePic: {
    width: "100%",
    height: "100%"
    //borderRadius: 100 / 2
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
