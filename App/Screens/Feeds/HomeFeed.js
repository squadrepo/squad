import React, { useContext, useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import { SocialPostScreen } from '../Social/socialPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocialEventCard } from '../../Components/SocialEventCard';
import { feedStyles as styles } from './FeedStyles';

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
  } = useContext(UserContext);

  // This will get the user's information and store the info in the correct states
  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const UUID = currentUser.attributes.sub;
        setUid(UUID);

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
  }, []);

  // Social events feed
  const [socialEvents, setSocialEvents] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const getSocialEvents = async () => {
      try {
        // Univ will be empty at first since we set it on this page. This useEffect runs again when it's updated.
        if (!univ) return;
        const response = await axios.get(`${BASE_API_URL}/socialEvent/getEvents?univ=${univ}`);
        const socialEvents = response.data.sort((a, b) => a.eventTimestamp - b.eventTimestamp)
        setSocialEvents(socialEvents);
        setIsFetching(false);
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}: `, response.data);
      }
    };

    getSocialEvents();
  }, [univ, triggerFetch]);

  const onRefresh = () => {
    setTriggerFetch(!triggerFetch);
    setIsFetching(true)
  }

const AllPostsFeed = ({navigation}) => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="headlineMedium" style={styles.topBarText}> Posts for {univ}</Text>
        <Button style={styles.topBarButton} onPress={() => navigation.navigate('RsvpFeed')}>RSVP's</Button>
      </View>
      <FlatList 
      data={socialEvents}
      renderItem={({item}) => <SocialEventCard event={item} navigation={navigation} root='HomeFeed'/>} 
      extraData={socialEvents.length} 
      keyExtractor={event => event?.eid}
      onRefresh={onRefresh}
      refreshing={isFetching}/>
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed" component={AllPostsFeed} />
      <Stack.Screen name="SocialPost" component={SocialPostScreen} />
    </Stack.Navigator>
  );
};
