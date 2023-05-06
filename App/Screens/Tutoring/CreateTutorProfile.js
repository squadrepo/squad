/*
Bugs/Things to fix/TO-DO:

Modify text on screens evan worked on with react native paper typography
*/

/*
Other to do
-Fix adding time not changing time for more than one day
-Add functionality to remove tags
-Add functionality for camera
*/

import React, { Component, useContext, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text, Pressable, ScrollView } from "react-native";
import { Button, Appbar, Modal, Portal, TextInput, HelperText } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import axios from 'axios';
import { FlatList } from "react-native-gesture-handler";


export const CreateTutorProfile = ({ navigation, route }) => {

  const {
    fullName,
    pfpUrl,
    setPfpUrl,
    uid,
    setUid
  } = React.useContext(UserContext);

  //URL used to GET users info
  const getUrl =
    'https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=';

  async function getUserUUID() {
    try {
      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();
      // Get the user's UUID
      const userUUID = currentUser.attributes.sub;

      return userUUID;
    } catch (error) {
      console.log('Error getting user UUID:', error);
      throw error;
    }
  }

  //This will get the users information and store the info in the correct states
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const UUID = await getUserUUID();
        setUid(UUID);

        // GET request for user info
        axios.get(`${getUrl}${UUID}`).then((response) => {
          //set user states
          setPfpUrl(response.data.pfpUrl);
        });
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };
    getUser();
  }, []);

  //URL used to POST users info
  const url = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/tutoring/createtutorprofile";

  const updateData = {
    "uid": uid,
    "bio": "",
    "availability": {"Sun": [[900,1700]], "Mon": [[900,1700]], "Tue": [[900,1700]], "Wed": [[900,1700]], "Thu": [[900,1700]], "Fri": [[900,1700]], "Sat": [[900,1700]]},
    "hrRate": 0,
    "subjects": [],
    "classesTaken": []
  };

  const updateTutorProfile = async () => {
    try {
      const response = await axios.post(url, updateData);
      console.log("Tutor table: ", updateData);
      console.log("Tutor table updated:", response.status);
    } catch (error) {
      alert("An error has occurred");

      if (error.response === undefined) {
        throw error;
      }
      const { response } = error;
      console.log(response.status);
      console.log(response.data);
    }
  };

  const save = () => {
    console.log(updateData);
    //updateTutorProfile();
    //navigation.navigate("HomeFeed");
  }

  const updatePhoto = {};
  function getPfpUrl() {}

  function getBio() {
    if (route.params?.bio) {
      updateData["bio"] = route.params?.bio;
      return updateData["bio"];
    } else {
      return updateData["bio"];
    }
  }
  
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [changeDay, setChangeDay] = useState('')
  const [isDatePicker1Visible, setDatePicker1Visibility] = useState(false);
  const [isDatePicker2Visible, setDatePicker2Visibility] = useState(false);
  const showDatePicker1 = () => {setDatePicker1Visibility(true)};
  const showDatePicker2 = () => {setDatePicker2Visibility(true)};
  const hideDatePicker1 = () => {setDatePicker1Visibility(false)};
  const hideDatePicker2 = () => {setDatePicker2Visibility(false)};
  const handleConfirm1 = (date) => {
    setStartTime(parseInt(Moment(date).format('Hmm')));
    hideDatePicker1();
    showDatePicker2();
  };
  const handleConfirm2 = (date) => {
    if (parseInt(Moment(date).format('Hmm')) > startTime) {
      setEndTime(parseInt(Moment(date).format('Hmm')));
    }
    hideDatePicker2();
  }

  function getTime(day) {
    const days = updateData.availability;
    let time = "";
    
    if (day == "Sun") {
      if ((startTime && endTime) && changeDay == "Sun") {
        days.Sun = [[startTime, endTime]];
      }
      for (i = 0; i < days.Sun.length; i++) {
        time += Moment(days.Sun[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Sun[i][1], 'Hmm').format('h:mm a') + ", ";
      }
      return time;
    }
    if (day == "Mon") {
      if ((startTime && endTime) && changeDay == "Mon") {
        days.Mon = [[startTime, endTime]];
      }
      for (i = 0; i < days.Mon.length; i++) {
        time += Moment(days.Mon[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Mon[i][1], 'Hmm').format('h:mm a') + ", ";
      }
      return time;
    }
    if (day == "Tue") {
      if ((startTime && endTime) && changeDay == "Tue") {
        days.Tue = [[startTime, endTime]];
      }
      for (i = 0; i < days.Tue.length; i++) {
        time += Moment(days.Tue[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Tue[i][1], 'Hmm').format('h:mm a') + ", ";
      }
      return time;
    }
    if (day == "Wed") {
      if ((startTime && endTime) && changeDay == "Wed") {
        days.Wed = [[startTime, endTime]];
      }
      for (i = 0; i < days.Wed.length; i++) {
        time += Moment(days.Wed[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Wed[i][1], 'Hmm').format('h:mm a') + ", ";
      }
      return time;
    }
    if (day == "Thu") {
      if ((startTime && endTime) && changeDay == "Thu") {
        days.Thu = [[startTime, endTime]];
      }
      for (i = 0; i < days.Thu.length; i++) {
        time += Moment(days.Thu[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Thu[i][1], 'Hmm').format('h:mm a') + ", ";
      }
      return time;
    }
    if (day == "Fri") {
      if (changeDay == "Fri") {
        days.Fri = [[startTime, endTime]];
      }
      for (i = 0; i < days.Fri.length; i++) {
        time += Moment(days.Fri[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Fri[i][1], 'Hmm').format('h:mm a') + ", ";
      }
      return time;
    }
    if (day == "Sat") {
      if (changeDay == "Sat") {
        days.Sat = [[startTime, endTime]];
      }
      for (i = 0; i < days.Sat.length; i++) {
        time += Moment(days.Sat[i][0], 'Hmm').format('h:mm a') + " - " + Moment(days.Sat[i][1], 'Hmm').format('h:mm a') + ", ";
      }

      return time;
    }
  }

  function changeTime(day) {
    setChangeDay(day);
    showDatePicker1();
  }

  function getAvailability() {
    return updateData["availability"];
  }

  function displaySubject(subject) {
    return (<Tag key={subject} tag={{ name: subject }}/>)
  }

  function makeSubjectTags(subjects) {
    const subjectTags = subjects.map((subject) =>
      displaySubject(subject)
    );
    return subjectTags;
  }

  function getSubjects() {
    if (route.params?.subjects) {
      updateData["subjects"] = route.params?.subjects;
      return updateData["subjects"];
    } else {
      return updateData["subjects"];
    }
  }

  function displayCourse(course) {
    return (<Tag key={course} tag={{ name: course }}/>)
  }

  function makeCourseTags(courses) {
    const courseTags = courses.map((course) =>
      displayCourse(course)
    );
    return courseTags;
  }

  function getClassesTaken() {
    if (route.params?.classesTaken) {
      updateData["classesTaken"] = route.params?.classesTaken;
      return updateData["classesTaken"];
    } else {
      return updateData["classesTaken"];
    }
  }

  function onChangeText(rate) {
    if (/^[0-9]+(\.[0-9]{1,2})?$/.test(rate)) {
      setHrRate(rate);
      updateData["hrRate"] = parseInt(rate);
      console.log(rate);
      console.log(updateData.hrRate);
    }
  }

  function getHrRate() {
    if (route.params?.hrRate) {
      updateData["hrRate"] = route.params?.hrRate;
      return updateData["hrRate"];
    } else {
      return updateData["hrRate"];
    }
  }
    
  

  return (
    <View style={{flex:1}}>

    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Create/Edit Tutor Profile" />
      <Button textDecoration="underline" onPress={save}>Save</Button>
    </Appbar.Header>

    <ScrollView>
    <View style={styles.changePhoto}>

      <View style={styles.profilePicContainer}>
      <Image style={styles.profilePic} source={{uri: pfpUrl}}/>
      </View>

    </View>

    <SafeAreaView style={styles.container}>
    
      <View style={styles.profileDetails}>
        <Text style={styles.textHeader}>Name</Text>
        <Text style={styles.textInputName} label="Full Name">
                {fullName}
        </Text>

        <Pressable onPress={() => navigation.navigate("CreateTutorProfileBio", {
          bio: getBio(),
          availability: getAvailability(),
          hrRate: getHrRate(),
          subject: getSubjects(),
          classesTaken: getClassesTaken(),
          pfpUrl: getPfpUrl(),
        })}>
        <Text style={styles.textHeader}>About Me</Text>
          <Text style={styles.textInput} multiline={true} label="About Me">
            {getBio()}
          </Text>
        </Pressable>

        <DateTimePickerModal isVisible={isDatePicker1Visible} mode="time" onConfirm={handleConfirm1} onCancel={hideDatePicker1}/>
        <DateTimePickerModal isVisible={isDatePicker2Visible} mode="time" onConfirm={handleConfirm2} onCancel={hideDatePicker2}/>
        <Text style={styles.textHeader}>Availability</Text>
          <Text style={styles.timeInput} multiline={true} label="Availability">
            <Pressable onPress={() => changeTime("Sun")}><Text>Sun   {getTime("Sun")}</Text></Pressable> {'\n'}
            <Pressable onPress={() => changeTime("Mon")}><Text>Mon   {getTime("Mon")}</Text></Pressable> {'\n'}
            <Pressable onPress={() => changeTime("Tue")}><Text>Tue   {getTime("Tue")}</Text></Pressable> {'\n'}
            <Pressable onPress={() => changeTime("Wed")}><Text>Wed   {getTime("Wed")}</Text></Pressable> {'\n'}
            <Pressable onPress={() => changeTime("Thu")}><Text>Thu   {getTime("Thu")}</Text></Pressable> {'\n'}
            <Pressable onPress={() => changeTime("Fri")}><Text>Fri   {getTime("Fri")}</Text></Pressable> {'\n'}
            <Pressable onPress={() => changeTime("Sat")}><Text>Sat   {getTime("Sat")}</Text></Pressable> {'\n'}
          </Text>
      </View>

    <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>
    
    <View style={styles.tagList}>

      <Text style={styles.categoryText}>Subjects</Text>
      <View style={styles.tagCategory}>

        {makeSubjectTags(getSubjects())}
        <View style={styles.tag}>
          <Button mode="outlined" onPress={() => navigation.navigate("CreateTutorProfileSubjects", {
          bio: getBio(),
          availability: getAvailability(),
          hrRate: getHrRate(),
          subjects: getSubjects(),
          classesTaken: getClassesTaken(),
          pfpUrl: getPfpUrl(),
        })}>
            +
          </Button>
        </View>

      </View>

      <Text style={styles.categoryText}>Courses Taken</Text>
      <View style={styles.tagCategory}>

        {makeCourseTags(getClassesTaken())}
        <View style={styles.tag}>
          <Button mode="outlined" onPress={() => navigation.navigate("CreateTutorProfileCourses", {
          bio: getBio(),
          availability: getAvailability(),
          hrRate: getHrRate(),
          subjects: getSubjects(),
          classesTaken: getClassesTaken(),
          pfpUrl: getPfpUrl(),
        })}>
            +
          </Button>
        </View>

      </View>

      <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>

      <Pressable onPress={() => navigation.navigate("CreateTutorProfileRate", {
          bio: getBio(),
          availability: getAvailability(),
          hrRate: getHrRate(),
          subject: getSubjects(),
          classesTaken: getClassesTaken(),
          pfpUrl: getPfpUrl(),
        })}>
      <Text style={styles.textHeader}>Hourly Rate</Text>
      <Text style={styles.textInput} label="HrRate">
        $ {getHrRate()}
      </Text>
      </Pressable>

    </View>
    </SafeAreaView>
    </ScrollView>
    </View>
  );
};

const Tag = ({ tag }) => <View style={styles.tag}><Button mode="outlined" onPress={() => console.log('Pressed')}>#{tag.name}</Button></View>;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },

  changePhoto: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },

  profilePicContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
  },

  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100/2,
  },

  profileDetails: {
    padding: 10,
    paddingLeft: 15,
    alignSelf: 'flex-start',
    alignItems: "stretch",
    alignContent: "stretch",
  },

  textHeader: {
    fontWeight: '400', 
    color: "grey",
    paddingTop: 12,
    paddingBottom: 5,
  },

  textInput: {
    borderBottomColor: 'black', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
  },

  timeInput: { 
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
    paddingLeft: 45,
    fontSize: 30,
  },

  textInputName: {
    fontWeight: 'bold',
    alignItems: "stretch",
    alignContent: "stretch",
    alignSelf: 'flex-start',
  },

  circle: {
    width: 90, 
    height: 90, 
    borderRadius: 90/2, 
    backgroundColor: 'black',
  },

  profileDesc: {
    padding: 15,
  },

  tagList: {
    padding: 10,
    paddingLeft: 15,
    alignSelf: 'flex-start',
  },

  categoryText: {
    fontSize: 16, 
    paddingBottom: 8
  },

  tagCategory: {
    flexDirection: "row",
    paddingBottom: 5,
    flexWrap: "wrap",
  },

  tag: {
    paddingLeft: 2,
    paddingBottom: 5,
  },

  addTag: {
    paddingLeft: 2,
    paddingBottom: 5,
  },
});
