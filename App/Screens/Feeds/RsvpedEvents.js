import React, { useContext, useEffect, useState } from 'react';
import { Text, IconButton } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import { SocialPostScreen } from '../Social/socialPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocialEventCard } from '../../Components/SocialEventCard';
import { feedStyles as styles } from './FeedStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        var response = await axios.get(`${BASE_API_URL}/socialEvent/getEvents?univ=${univ}`);
        for (const item of response.data) {
            try {
                await AsyncStorage.removeItem(`${item.eid}_Yes`);
                await AsyncStorage.removeItem(`${item.eid}_Maybe`);
            } catch (error) {
                console.log(error)
            }
        } 
        filteredResponse = response.data.filter(event => event.uidsRsvp.includes(uid) || event.uidsInterested.includes(uid));
        const RsvpEvents = filteredResponse.sort((a, b) => a.eventTimestamp - b.eventTimestamp)
        for (const item of RsvpEvents) {
            if (item.uidsRsvp.includes(uid)){
                await AsyncStorage.setItem(`${item.eid}_Yes`, "contained");
            } else {
                await AsyncStorage.setItem(`${item.eid}_Maybe`, "contained");
            }
            
          }
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
        <View style={styles.plusButton}>
        <IconButton 
        icon="plus" 
        size={40} 
        iconColor='#000000' 
        onPress={() => navigation.navigate("ChooseEventType")}/>
        </View>
      </View>
      <FlatList 
      data={RsvpEvents}
      renderItem={({item}) => <SocialEventCard event={item} navigation={navigation}/>} 
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
