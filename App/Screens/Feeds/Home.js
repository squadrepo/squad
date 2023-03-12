import React, { useContext, useEffect, useState } from 'react';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView, View, FlatList, Image, StyleSheet } from 'react-native';
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import { BASE_API_URL, PURPLE_COLOR } from '../../constants';
import axios from 'axios';
import { getStringDateFromUnix, getStandardPlural } from '../../utilities';
import { SocialPostScreen } from '../Social/socialPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const MainFeed = () => {
  const Stack = createNativeStackNavigator();

  const {
    aboutMe,
    setAboutMe,
    classHist,
    setClassHist,
    dispTags,
    setDispTags,
    dob,
    setDOB,
    email,
    setEmail,
    emailLastVerifiedDate,
    setEmailLastVerifiedDate,
    fullName,
    setFullName,
    pfpUrl,
    setPfpUrl,
    tags,
    setTags,
    tutorRating,
    setTutorRating,
    uid,
    setUid,
    univ,
    setUniv,
    univExclExp,
    setUnivExclExp,
    username,
    setUsername
  } = useContext(UserContext);

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
  useEffect(() => {
    const getUser = async () => {
      try {
        const UUID = await getUserUUID();
        setUid(UUID);

        // GET request for user info
        axios.get(`${BASE_API_URL}/account/user?uid=${UUID}`).then((response) => {
          //set user states
          setAboutMe(response.data.aboutMe);
          setClassHist(response.data.classHist);
          setDispTags(response.data.dispTags);
          setDOB(response.data.dob);
          setEmail(response.data.email);
          setEmailLastVerifiedDate(response.data.emailLastVerifiedDate);
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
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };
    getUser();
  }, []);

  const [socialEvents, setSocialEvents] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const getSocialEvents = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/socialEvent/getEvents?univ=${univ}`);
        const socialEvents = response.data.sort((a, b) => a.eventTimestamp - b.eventTimestamp)
        setSocialEvents(socialEvents);
        setIsFetching(false);
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };

    getSocialEvents();
  }, [univ, triggerFetch]);
  const onRefresh = () => {
    setTriggerFetch(!triggerFetch);
    setIsFetching(true)
  }

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#DDDDDD",
  },
  topBar: {
    backgroundColor:'#EADDFF',
    padding: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  topBarText: {
    color: 'black',
    fontWeight: 'bold',
    // textShadowColor: "#00000075",
    // textShadowOffset: {width: -1, height: 1},
    // textShadowRadius: 10
  },
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    paddingBottom: 0,
  },
  eventNameText: {
    fontWeight: "bold",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
  },
  actionText: {
    color: '#9662fc'
  }
})

const ACTION_TEXT_VARIANT =  "labelSmall"
const bullet = (<Text variant={ACTION_TEXT_VARIANT} style={{fontWeight: 'bold'}}>· </Text>);


const SocialCard = ({event, navigation, styles}) => {
  const numGoing = event.uidsRsvp.length;
  const numInterested = event.uidsInterested.length;
  const numComments = event.comments.length;
  const uri = (event.bannerUrl && event.bannerUrl.length > 0)
    ? event.bannerUrl 
    : "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png";
  return (
  <Card style={styles.card} onPress={() =>
            navigation.navigate('SocialPost', {event: event, root:'HomeFeed'})}>
    <Card.Cover source={{ uri: uri }}/>
    <Card.Title title={event.eventName} titleStyle={styles.eventNameText} subtitle={getStringDateFromUnix(event.eventTimestamp)}/>
    <Card.Content style={styles.cardContent}>
      <Text style={{width: 120}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT} style={styles.actionText}>{numGoing} student{getStandardPlural(numGoing)} going</Text>
      </Text>
      <Text style={{width: 100}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT} style={styles.actionText}>{numInterested} interested</Text>
      </Text>
      <Text style={{width: 100}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT}>{numComments} comment{getStandardPlural(numComments)}</Text>
      </Text>
    </Card.Content>
  </Card>
)};

const HomeFeed = ({navigation}) => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="headlineMedium" style={styles.topBarText}> Posts for {univ}</Text>
      </View>
      <FlatList 
      data={socialEvents}
      renderItem={({item}) => <SocialCard event={item} navigation={navigation} styles={styles}/>} 
      extraData={socialEvents.length} 
      keyExtractor={event => event?.eid}
      onRefresh={onRefresh}
      refreshing={isFetching}/>
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed" component={HomeFeed} />
      <Stack.Screen name="SocialPost" component={SocialPostScreen} />
    </Stack.Navigator>
  );
};
