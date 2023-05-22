import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, Card, Avatar, IconButton } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import { SocialPostScreen } from '../Social/socialPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocialEventCard } from '../../Components/SocialEventCard';
import { FoodEventCard } from '../../Components/FoodEventCard';
import { feedStyles as styles } from './FeedStyles';
import { TutorProfileCard } from '../../Components/TutorProfileCard';
import { FoodPostScreen } from '../Food/foodPost.screen';
import { TutorProfile } from '../Tutoring/TutorProfile';
import { color } from 'react-native-reanimated';

export const HomeFeed = () => {
  const {
    univ,
    setAboutMe,
    setChatroomCids,
    setClassHist,
    setDispTags,
    setDobNum,
    setEmail,
    setEmailLastVerifiedDateNum,
    setFullName,
    setPfpUrl,
    setTags,
    setTutorRating,
    setUid,
    setUniv,
    setUnivExclExp,
    setUsername,
    fetchUserTrigger, 
    triggerUserFetch
  } = useContext(UserContext);

  // This will get the user's information and store the info in the correct states
  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const UUID = currentUser.attributes.sub;
        setUid(UUID);
        console.log("Fetching user");
        // GET request for user info
        axios.get(`${BASE_API_URL}/account/user?uid=${UUID}`).then((response) => {
          //set user states
          setAboutMe(response.data.aboutMe);
          setChatroomCids(response.data.chatroomCids);
          setClassHist(response.data.classHist);
          setDispTags(response.data.dispTags);
          setDobNum(response.data.dob);
          setEmail(response.data.email);
          setEmailLastVerifiedDateNum(response.data.emailLastVerifiedDate);
          setFullName(response.data.fullName);
          setPfpUrl(response.data.pfpUrl);
          setTags(response.data.tags);
          setTutorRating(response.data.tutorRating);
          setUniv(response.data.univ);
          setUnivExclExp(response.data.univExclExp);
          setUsername(response.data.username);
        });
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}: `, response.data);
      }
    };
    getUser();
  }, [fetchUserTrigger]);

  // Social events feed
  const [posts, setPosts] = useState([]);
  const [socialEvents, setSocialEvents] = useState([]);
  const [areSocialsLoaded, setAreSocialsLoaded] = useState(false);
  const [foodEvents, setFoodEvents] = useState([]);
  const [areFoodsLoaded, setAreFoodsLoaded] = useState(false);
  const [tutorProfiles, setTutorProfiles] = useState([]);
  const [areTutorsLoaded, setAreTutorsLoaded] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const Stack = createNativeStackNavigator();
  const subject = "Computer Science";
  useEffect(() => {
    const getSocialEvents = async () => {
      try {
        if (!univ) return;
        const response = await axios.get(`${BASE_API_URL}/socialEvent/getEvents?univ=${univ}`);
        const socialEvents = response.data.sort((a, b) => a.eventTimestamp - b.eventTimestamp)
        setSocialEvents(socialEvents);
      } catch (error) {
        setSocialEvents([]);
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}: `, response.data);
      }
      setAreSocialsLoaded(true);
    };

    const getFood = async () => {
      try {
        if (!univ) return;
        const response = await axios.get(`${BASE_API_URL}/foodEvent?coords=${39.95380477768779},${-75.18490433692932}&radius=${2}`);
        const foodEvents = response.data;
        setFoodEvents(foodEvents);
      } catch (error) {
        setFoodEvents([]);
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}:`, response.data);
      }
      setAreFoodsLoaded(true);
    };

    const getTutors = async () => {
      try {
        if (!univ) return;
        const response = await axios.get(`${BASE_API_URL}/tutoring/viewfeed?subject=${subject}&universityName=${univ}`);
        const tutors = response.data;
        setTutorProfiles(tutors);

      } catch (error) {
        setTutorProfiles([]);
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}:`, response.data);
      }
      setAreTutorsLoaded(true);
    };

    // Perform the fetches concurrently
    setIsFetching(true);
    getSocialEvents();
    getFood();
    getTutors();
  }, [univ, triggerFetch]);

  useEffect(() => {
    if (!areSocialsLoaded || !areFoodsLoaded || !areTutorsLoaded) return;
    const postArray = [...socialEvents, ...foodEvents, ...tutorProfiles];
    // random shuffle: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
    // We would want a better algorithm in the future, but this is enough for now
    for (let i = postArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = postArray[i];
      postArray[i] = postArray[j];
      postArray[j] = temp;
    }
    setPosts(postArray);
    setIsFetching(false);
  }, [areSocialsLoaded, areTutorsLoaded]);
  
  const onRefresh = () => {
    setAreSocialsLoaded(false);
    setAreFoodsLoaded(false);
    setAreTutorsLoaded(false);
    setTriggerFetch(!triggerFetch);
    setIsFetching(true);
  }

const AllPostsFeed = ({navigation}) => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="headlineMedium" style={styles.topBarText}> Posts for {univ}</Text>
        <View style={styles.plusButton}>
        <IconButton 
        icon="plus" 
        size={40} 
        iconColor='#000000' 
        onPress={() => navigation.navigate("ChooseEventType")}/>
        </View>
      </View>
      <FlatList 
        data={posts}
        renderItem={({item}) => 
          item?.eid 
            ? <SocialEventCard event={item} navigation={navigation}/>
            : item?.uid
              ? <TutorProfileCard tutorProfile={item} navigation={navigation}/>
              : item?.hashKey 
                ? <FoodEventCard event={item} navigation={navigation}/>
                : <></>} 
        extraData={socialEvents.length} 
        keyExtractor={(post, index) => index}
        onRefresh={onRefresh}
        refreshing={isFetching}/>
        <View style={styles.buttonContainer}>
        <Button
            mode="contained"
            onPress={() => navigation.navigate('RsvpFeed')}
            style={styles.rsvpButton}>
            RSVP's
          </Button>
        </View>
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed" component={AllPostsFeed} />
      <Stack.Screen name="SocialPost" component={SocialPostScreen} />
      <Stack.Screen name="FoodPostScreen" component={FoodPostScreen} />
      <Stack.Screen name="TutorProfile" component={TutorProfile} />
    </Stack.Navigator>
  );
};
