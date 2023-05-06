import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  Image,
  View,
  StyleSheet,
  Platform,
  Text
} from "react-native";
import { Button, Appbar, Divider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext } from "../../Context";
import axios from "axios";

export const SelectTutorSession = ({ navigation }) => {
  //Tutors profile picture and uuid should just be passed from previous screen so
  //just hard coded values for those two rn
  const { uid } = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [epoch, setEpoch] = useState(null);

  const requestUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/tutoring/requestSession";

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
      updateEpoch(date, selectedTime);
    }
  };

  const handleTimeChange = (event, time) => {
    if (time !== undefined) {
      setSelectedTime(time);
      updateEpoch(selectedDate, time);
    }
  };

  const updateEpoch = (date, time) => {
    const dateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    const epochValue = Math.floor(dateTime.getTime() / 1000); // Convert to seconds
    setEpoch(epochValue);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerPopup = () => {
    setShowDatePicker(false);
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  const hideTimePickerPopup = () => {
    setShowTimePicker(false);
  };

  const requestSession = async () => {
    const requestBody = {
      tutorUid: "c6030b8d-771b-454b-af0b-4aba56f0b300",
      discipleUid: uid,
      timestampRequested: epoch
    };

    axios
      .post(requestUrl, requestBody)
      .then((response) => {
        // Handle successful response
        console.log("Request sent successfully");
        alert("Tutor request sent");
        navigation.navigate("Main");
      })
      .catch((error) => {
        // Handle error
        console.error("Error sending request:", error);
      });
  };
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.navigate("ChooseEventType")}
        />
        <Appbar.Content title="Schedule Session" />
      </Appbar.Header>
      <SafeAreaView style={styles.right}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{ uri: "https://i.redd.it/v0caqchbtn741.jpg" }}
          />
        </View>
        <View style={styles.datePickerContainer}>
          <Button onPress={openDatePicker} mode="contained">
            Select Date
          </Button>
          {showDatePicker && (
            <View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date("2023-01-01")}
                maximumDate={new Date("2023-12-31")}
                onChange={handleDateChange}
              />
              <Button onPress={hideDatePickerPopup} mode="contained">
                Done
              </Button>
            </View>
          )}
          <Text style={styles.selectedDateTimeText}>
            Selected Date: {selectedDate.toDateString()}
          </Text>
        </View>
        <View style={styles.datePickerContainer}>
          <Button onPress={openTimePicker} mode="contained">
            Select Time
          </Button>
          {showTimePicker && (
            <View>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
              <Button onPress={hideTimePickerPopup} mode="contained">
                Done
              </Button>
            </View>
          )}
          <Text style={styles.selectedDateTimeText}>
            Selected Time: {selectedTime.toLocaleTimeString()}
          </Text>
        </View>
        <Button
          mode="contained"
          style={styles.requestButton}
          onPress={requestSession}
        >
          Request Session
        </Button>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "white"
  },

  profileHeader: {
    flexDirection: "row",
    justifyContent: "center"
  },

  left: {
    alignSelf: "center",
    alignItems: "center",
    width: 135
  },
  edit: {
    padding: 10
  },

  right: {
    alignSelf: "center",
    alignItems: "center",
    padding: 10
  },

  profilePicContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180
  },

  profilePic: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2
  },

  circle: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    backgroundColor: "black"
  },

  datePickerContainer: {
    marginVertical: 10,
    alignItems: "center"
  },

  datePicker: {
    width: 200,
    height: 40,
    marginBottom: 10
  },

  timePickerContainer: {
    alignItems: "center"
  },

  timePicker: {
    width: 200,
    height: 40
  },

  selectedDateTimeText: {
    fontSize: 16
  },

  requestButton: {
    marginTop: 10
  }
});
