import * as React from "react";
import { TextInput, Button, Text, Avatar, Title, Caption, TouchableRipple, Modal, Portal} from "react-native-paper";
import { SafeAreaView, StyleSheet, View} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AirbnbRating } from 'react-native-ratings';
import { PURPLE_COLOR } from "../../constants";
import { stopLocationUpdatesAsync } from "expo-location";
import { styles } from "./TutorProfileStyles";


export const TutorProfile = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [rating, setRating] = React.useState(0);

    sampleData = [{
        "Name":"James Bond", 
        "Id": "jb007",
        "Sessions": 1000, 
        "Image":"https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png",
        "Rating": 2,
        "Bio": "The name is Bond. James Bond.",
        "Avail": {"Sat": "9:00 AM - 5:00 PM", "Sun": "9:00 AM - 1:00 PM, 2:00 PM - 3:00 PM"}, 
        "Tags": ["Math", "Algebra"],
        "Courses": ["MATH123", "MATH391"]
    }]

    const handleRating = (rating) => {
        console.log(rating)
        setRating(rating)
    }


    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{flexDirection:"row"}}>
                    <Avatar.Image style= {styles.picture} size={150} source={{ uri: sampleData[0].Image }} />
                <View>
                    <Title style={styles.title}>{sampleData[0].Name}</Title>
                    <Caption style={styles.caption}>@{sampleData[0].Id}</Caption>
                    <View style={styles.stars}>
                    <AirbnbRating
                    count={5}
                    isDisabled={true}
                    defaultRating={sampleData[0].Rating}
                    showRating={false}
                    size={30}
                    selectedColor={PURPLE_COLOR}/>
                    </View>
                    <Caption style={styles.caption}>{sampleData[0].Sessions} sessions tutored</Caption>
                </View>
                </View>
                <View style={styles.topButtons}>
                    <Button mode="contained" style={{marginLeft:30}}>Schedule a session</Button>
                    <Button mode="contained" style={{marginLeft:30}} onPress={() => setModalVisible(true)}>Leave a Rating</Button>
                </View>
                <View>
                    <Title style={styles.headline}>About Me</Title>
                    <Text style={styles.text}>{sampleData[0].Bio}</Text>
                </View>
                <View>
                    <Title style={styles.headline}>Schedule</Title>
                    {Object.entries(sampleData[0].Avail).map(([day, time]) => (
                        <Text style = {styles.text} key={day}> {day}: {time} </Text>))}
                </View>
                <View>
                    <Title style={styles.headline}>Tags</Title>
                    <View style = {styles.allTags} >
                    {sampleData[0].Tags.map((tag) => (
                        <Text style = {styles.tag} key={tag}> #{tag} </Text>))}
                        </View>
                </View>
                <View>
                    <Title style={styles.headline}>Courses Taken</Title>
                    <View style = {styles.allTags}>
                    {sampleData[0].Courses.map((course) => (
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
                                onFinishRating={handleRating}
                            />
                            <Button onPress={() => setModalVisible(false)} mode="contained" style={{marginTop:10}}> Submit </Button>
                            </View>
                    </Modal>
                </Portal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};




