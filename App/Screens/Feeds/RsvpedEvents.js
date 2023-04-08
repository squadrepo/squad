import React, { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import { SocialPostScreen } from '../Social/socialPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocialEventCard } from '../../Components/SocialEventCard';
import { feedStyles as styles } from './FeedStyles';

export const RsvpFeed = () => {
  const { univ } = useContext(UserContext);
  const Stack = createNativeStackNavigator();

  // Rsvp events feed
  const [RsvpEvents, setRsvpEvents] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { uid } = useContext(UserContext);
  useEffect(() => {
    uid;
  }, [uid]);

  useEffect(() => {
    const getRsvpEvents = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/socialEvent/getEvents?univ=${univ}`);
        const RsvpEvents = response.data.sort((a, b) => a.eventTimestamp - b.eventTimestamp)
        setRsvpEvents(RsvpEvents);
        setIsFetching(false);
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = error;
        return console.log(`${response.status}:`, response.data);
      }
    };

    getRsvpEvents();
  }, [univ, triggerFetch]);

  const onRefresh = () => {
    setTriggerFetch(!triggerFetch);
    setIsFetching(true)
  }

const RsvpPostsFeed = ({navigation}) => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="headlineMedium" style={styles.topBarText}>Rsvp Events for {univ}</Text>
      </View>
      <FlatList 
      data={RsvpEvents}
      renderItem={({item}) => <SocialEventCard event={item} navigation={navigation} root='SocialFeed'/>} 
      extraData={RsvpEvents.length} 
      keyExtractor={event => event?.eid}
      onRefresh={onRefresh}
      refreshing={isFetching}/>
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RsvpFeeds" component={RsvpPostsFeed} />
      <Stack.Screen name="RsvpPost" component={SocialPostScreen} />
    </Stack.Navigator>
  );
};
