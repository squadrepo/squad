import React, { useContext, useEffect, useState } from "react";
import {
  Appbar,
  Button,
  Text,
  Avatar,
  Title,
  Caption,
  ActivityIndicator,
  Modal,
  Portal
} from "react-native-paper";
import { SafeAreaView, StyleSheet, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AirbnbRating } from "react-native-ratings";
import { DEFAULT_PROFILE_PIC, PURPLE_COLOR } from "../../constants";
import { styles } from "./TutorProfileStyles";
import { BASE_API_URL } from "../../constants";
import { UserContext } from "../../Context";
import { getStandardPlural } from "../../utilities";
import axios from "axios";

export const TutorProfile = ({ navigation, route }) => {
  const {
    tutorUid,
    tutorRating,
    totalNumRatings,
    numDisciples
  } = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const { uid } = useContext(UserContext);
  const [tutorProfileData, setTutorProfileData] = React.useState();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(); //remember to update state after session is scheduled
  const [buttonText, setButtonText] = useState("Submit"); //remember to update state after session is scheduled

  useEffect(() => {
    const tutorData = async () => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/tutoring/viewtutorprofile`,
          {
            params: {
              uid: tutorUid
            }
          }
        );
        setTutorProfileData(response.data);
        setLoading(false);
      } catch (error) {
        const { response } = error;
        console.log(`${response.status}: `, response.data);
        console.error(error);
      }
    };
    tutorData();
  }, [rating]);

  const handleRating = async (rating) => {
    if (tutorProfileData.disciples.includes(uid)) {
      try {
        const body = {
          tutorUid: tutorUid,
          discipleUid: uid,
          rating: rating
        };
        console.log(`${BASE_API_URL}/tutoring/rate`);
        const response = await axios.post(
          `${BASE_API_URL}/tutoring/rate`,
          body
        );
        console.log(response.data);
    
        return true;
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}: `, response.data);
      }
    } else {
      return false;
    }
  };

  function convertToAMPM(time){
    if (time.toString().length == 3) {
        time = "0"+time
    }
    time = time.toString()
    timeStart = time.slice(0,2)
    timeEnd = time.slice(-2)

    convertedTime = ""
    if (Number(timeStart) > 12) {
        convertedTime+=(Number(timeStart)%12)+":"+timeEnd+" PM"
    } else if (Number(timeStart) == 24) {
        convertedTime+=(12)+":"+timeEnd+" PM"
    } 
    else {
        convertedTime+=timeStart+":"+timeEnd+" AM"
    }

    return convertedTime
  }

  function renderAvailability(avail) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days
      .filter((day) => avail[day].length > 0)
      .map((day) => {
        const times = avail[day].map(

          ([start, end]) => `${convertToAMPM(start)} - ${convertToAMPM(end)}`);
        return (
          <Text style={styles.text} key={day}>
            {day}: {times.join(", ")}
          </Text>
        );
      });
  }

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.activityIndicator}
        animating={true}
        color={PURPLE_COLOR}
      />
    );
  } else {
    return (
      <SafeAreaView>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() =>
              navigation.goBack()
            }
          />
          <Appbar.Content title="Back to Feed" />
        </Appbar.Header>
        <ScrollView>
          <View style={{ flexDirection: "row" }}>
            <Avatar.Image
              style={styles.picture}
              size={150}
              source={{ uri: tutorProfileData.pfpUrl || DEFAULT_PROFILE_PIC }}
            />
            <View>
              <Title style={styles.title}>{tutorProfileData.fullName}</Title>
              <View style={styles.stars}>
                <AirbnbRating
                  count={5}
                  isDisabled={true}
                  defaultRating={tutorRating}
                  showRating={false}
                  size={30}
                  selectedColor={PURPLE_COLOR}
                />
              </View>
              <Caption style={styles.caption}>
                Currently working with {numDisciples} student
                {getStandardPlural(numDisciples)}
              </Caption>
              <Caption style={styles.caption}>
                ${tutorProfileData.hrRate}/hour{" "}
              </Caption>
            </View>
          </View>
          <View style={styles.topButtons}>
            <Button
              mode="contained"
              style={{ marginLeft: 30 }}
              onPress={() =>
                navigation.navigate("SelectTutorSession", {
                  tutorUid: tutorUid,
                  tutorProfileData: tutorProfileData,
                  tutorRating: tutorRating
                })
              }
            >
              Schedule a session
            </Button>
            <Button
              mode="contained"
              style={{ marginLeft: 30 }}
              onPress={() => setModalVisible(true)}
            >
              Leave a Rating
            </Button>
          </View>
          <View>
            <Title style={styles.headline}>About Me</Title>
            <Text style={styles.text}>{tutorProfileData.bio}</Text>
          </View>
          <View>
            <Title style={styles.headline}>Schedule</Title>
            <View>{renderAvailability(tutorProfileData.availability)}</View>
          </View>
          <View>
            <Title style={styles.headline}>Tags</Title>
            <View style={styles.allTags}>
              {tutorProfileData.subjects.map((tag) => (
                <Text style={styles.tag} key={tag}>
                  {" "}
                  #{tag}{" "}
                </Text>
              ))}
            </View>
          </View>
          <View>
            <Title style={styles.headline}>Courses Taken</Title>
            <View style={styles.allTags}>
              {tutorProfileData.classesTaken.map((course) => (
                <Text style={styles.tag} key={course}>
                  {" "}
                  #{course}{" "}
                </Text>
              ))}
            </View>
          </View>
          <View>
            <Portal>
              <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                
              >
                <View style={styles.modalContent}>
                  <Title style={styles.modalTitle}>Leave a Rating</Title>
                  <AirbnbRating
                    count={5}
                    defaultRating={rating}
                    showRating={false}
                    size={30}
                    onFinishRating={(newRating) => {
                      handleRating(newRating).then((success) => {
                        if (!success) {
                          setErrorMsg(
                            "Meet with the tutor before rating."
                          );
                          setButtonText("Cancel");
                        } else {
                          setErrorMsg(null);
                        }
                      });
                    }}
                  />
                  {errorMsg && <Text style = {{color:"red", fontWeight: "bold"}}>{errorMsg}</Text>}
                  <Button
                    onPress={() => setModalVisible(false)}
                    mode="contained"
                    style={{ marginTop: 10 }}
                  >
                    {" "}
                    {buttonText}{" "}
                  </Button>
                </View>
              </Modal>
            </Portal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};
