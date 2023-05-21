import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { Button, Appbar, Switch, Menu, DatePicker } from "react-native-paper";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../../Context";
import axios from "axios";
import moment from "moment";
import { RNS3 } from "react-native-aws3";

export const FoodPostEvent = ({ navigation }) => {
  //User context variables
  const { univ, uid } = useContext(UserContext);
  const [time, setTime] = useState("9:00AM");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addressString, setAddressString] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [image, setImage] = useState(
    "http://clipart-library.com/images/kcMKrBBXi.jpg"
  );

  const baseUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/foodEvent";

  const geocodingEndpoint = "https://maps.googleapis.com/maps/api/geocode/json";
  const geoApiKey = "AIzaSyC4ZVO0b9I4oTAlod6_lwmuv1W9YPsPPXE";

  const postEvent = async (event) => {
    const fullAddress = `${address}, ${city}, ${state}`;
    setAddressString(fullAddress);
    if (!addressConfirmed) {
      Alert.alert(
        "Confirm Address",
        `Is this the correct address? ${fullAddress}`,
        [
          {
            text: "Change Address",
            onPress: () => console.log("Change Address pressed"),
            style: "cancel"
          },
          {
            text: "Confirm",
            onPress: async () => {
              try {
                const response = await axios.get(
                  `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${geoApiKey}`
                );
                const { lat, lng } = response.data.results[0].geometry.location;
                console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                setCoordinates([...coordinates, lat, lng]);
                //setCoordinates([...coordinates, lng]);
                setAddressConfirmed(true);
              } catch (error) {
                console.error(error);
              }
            }
          }
        ]
      );
    } else {
      try {
        const epochTime = moment(
          `1970-01-01T${time}:00`,
          "YYYY-MM-DDTHH:mm:ss"
        ).unix();

        //convert date to epoch
        const [month, day, year] = date.split("/");
        const epochDate = Date.UTC(year, month - 1, day) / 1000;

        const eventTimestamp = new Date(epochTime + epochDate).getTime() - 3600;
        const endTime = eventTimestamp + duration * 3600;

        const body = {
          coords: coordinates,
          eventName: title,
          bannerUrl: image,
          desc: description,
          requirements: requirements,
          address: addressString,
          posterUid: uid,
          startEndTimestamp: [eventTimestamp, endTime]
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
    }
  };

  const handleDonePress = () => {
    // Do something with the text input value
    console.log("submitted");
    Keyboard.dismiss();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      // Upload the image to S3 bucket
      const file = {
        uri: result.uri,
        name: `event-${Date.now()}.jpg`,
        type: "image/jpeg"
      };
      const options = {
        keyPrefix: "",
        bucket: "squad-app-s3",
        region: "us-east-1",
        accessKey: "AKIA4H2NY2E7QGQUQ5FQ",
        secretKey: "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",
        successActionStatus: 201
      };
      const response = await RNS3.put(file, options);
      console.log(response);

      if (response.status !== 201) {
        console.log(response.status);
        throw new Error("Failed to upload image to S3");
      }

      setImage(response.body.postResponse.location);
    }
  };

  const handleDateChange = (value) => {
    setDate(value);
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      setDateError("Please enter a date in the format MM/DD/YYYY");
    } else {
      setDateError("");
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
        <Appbar.BackAction
          onPress={() => navigation.navigate("ChooseEventType")}
        />
        <Appbar.Content title="Create Food Post" />
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
          label="Date: MM/DD/YYYY"
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
          label="Duration in hours: 1 - 8"
          value={duration}
          keyboardType="numeric"
          onChangeText={(text) => {
            const durationValue = parseInt(text);
            if (durationValue >= 1 && durationValue <= 8) {
              setDuration(durationValue);
            } else {
              setDuration("");
            }
          }}
        />
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
          label="Requirements"
          multiline={true}
          numberOfLines={5}
          maxLength={300}
          value={requirements}
          onChangeText={(text) => setRequirements(text)}
          returnKeyType="done"
          onSubmitEditing={handleDonePress}
        />
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
  },
  requestButton: {
    marginTop: 10
  }
});
