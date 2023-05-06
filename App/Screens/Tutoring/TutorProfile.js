import React, {useContext, useEffect, useState} from "react";
import { TextInput, Button, Text, Avatar, Title, Caption, ActivityIndicator, Modal, Portal} from "react-native-paper";
import { SafeAreaView, StyleSheet, View, Image} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AirbnbRating } from 'react-native-ratings';
import { DEFAULT_PROFILE_PIC, PURPLE_COLOR } from "../../constants";
import { stopLocationUpdatesAsync } from "expo-location";
import { styles } from "./TutorProfileStyles";
import { BASE_API_URL } from "../../constants";
import { UserContext } from '../../Context';
import axios from 'axios';

export const TutorProfile = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [rating, setRating] = React.useState(0);
    const { uid } = useContext(UserContext);                 
    const [tutorProfileData, setTutorProfileData] = React.useState();
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState();                //remember to update state after session is scheduled
    const [buttonText, setButtonText] = useState("Submit");    //remember to update state after session is scheduled
    const tutorUid = "c6030b8d-771b-454b-af0b-4aba56f0b300"    //get this from the previous screen 
    const tutorRating = 3 //get this from brett's screen
    const sessionsTutored = 1000 //also from brett's screen 

    sampleData = [{
        "Image":"https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png",
        "Avail": {"Sat": "9:00 AM - 5:00 PM", "Sun": "9:00 AM - 1:00 PM, 2:00 PM - 3:00 PM"}, 
    }]

    useEffect(() => {
        const tutorData = async() => {
            try {
                const response = await axios.get(`${BASE_API_URL}/tutoring/viewtutorprofile`, {
                  params: {
                    uid: tutorUid
                  }
                });
                setTutorProfileData(response.data)
                setLoading(false);
              } catch (error) {
                console.error(error);
              }}
        tutorData()
    }, [rating])


    const handleRating = async (rating) => {
            if (tutorProfileData.disciples.includes(uid)){
                try {
                    const body = {
                        tutorUid: tutorUid,
                        discipleUid: uid,
                        rating: rating
                    }
                    console.log(`${BASE_API_URL}/tutoring/rate`)
                    const response = await axios.post(`${BASE_API_URL}/tutoring/rate`, body);
                    console.log(response.data)
                    return true 
                } catch (error) {
                    if (error.response == undefined) throw error;
                    const { response } = error;
                    console.log(`${response.status}: `, response.data);
                  }

            } else {
                return false
            }
    }; 



    function renderAvailability(avail) {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      
        return days
          .filter((day) => avail[day].length > 0)
          .map((day) => {
            const times = avail[day].map(([start, end]) => `${start} - ${end}`);
            return (
              <Text style={styles.text} key={day}>
                {day}: {times.join(", ")}
              </Text>
            );
          });
      }

    if (loading) {
        return (
               <ActivityIndicator style={styles.activityIndicator} animating={true} color={PURPLE_COLOR} />
        )

    } else {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{flexDirection:"row"}}>
                    <Avatar.Image style= {styles.picture} size={150} source={{uri: tutorProfileData.pfpUrl || DEFAULT_PROFILE_PIC}} />
                <View>
                    <Title style={styles.title}>{tutorProfileData.fullName}</Title>
                    <View style={styles.stars}>
                    <AirbnbRating
                    count={5}
                    isDisabled={true}
                    defaultRating={tutorRating}
                    showRating={false}
                    size={30}
                    selectedColor={PURPLE_COLOR}/>
                    </View>
                    <Caption style={styles.caption}>{sessionsTutored} sessions tutored</Caption>
                    <Caption style={styles.caption}>${tutorProfileData.hrRate}/hour </Caption>
                </View>
                </View>
                <View style={styles.topButtons}>
                    <Button mode="contained" style={{marginLeft:30}}>Schedule a session</Button>
                    <Button mode="contained" style={{marginLeft:30}} onPress={() => setModalVisible(true)}>Leave a Rating</Button>
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
                    <View style = {styles.allTags} >
                    {tutorProfileData.subjects.map((tag) => (
                        <Text style = {styles.tag} key={tag}> #{tag} </Text>))}
                        </View>
                </View>
                <View>
                    <Title style={styles.headline}>Courses Taken</Title>
                    <View style = {styles.allTags}>
                    {tutorProfileData.classesTaken.map((course) => (
                        <Text style = {styles.tag} key={course}> #{course} </Text>))}
                        </View>
                </View>
                <View>
                <Portal>
                    <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
                                        setErrorMsg("Schedule a meeting with the tutor before rating.")
                                        setButtonText("Cancel")
                                    } else {
                                        setErrorMsg(null)
                                    }
                                })
                            }}
                            />
                            {errorMsg && <Text>{errorMsg}</Text>}
                            <Button onPress={() => setModalVisible(false)} mode="contained" style={{marginTop:10}}> {buttonText} </Button>
                            </View>
                    </Modal>
                </Portal>
                </View>
            </ScrollView>
        </SafeAreaView>
    )};
};



