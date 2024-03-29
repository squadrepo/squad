import React, { useContext, useEffect, useState } from 'react';
import { Text, Button, IconButton} from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import { SocialPostScreen } from '../Social/socialPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocialEventCard } from '../../Components/SocialEventCard';
import { feedStyles as styles } from './FeedStyles';
import { RsvpFeed } from "../Feeds/RsvpedEvents";

export const SocialFeed = () => {
  const { univ } = useContext(UserContext);
  const Stack = createNativeStackNavigator();

  // Social events feed
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
        const { response } = error;
        return console.log(`${response.status}:`, response.data);
      }
    };

    getSocialEvents();
  }, [univ, triggerFetch]);

  const onRefresh = () => {
    setTriggerFetch(!triggerFetch);
    setIsFetching(true)
  }

const SocialPostsFeed = ({navigation}) => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="headlineMedium" style={styles.topBarText}>Social Events for {univ}</Text>
        <View style={styles.plusButton}>
        <IconButton 
        icon="plus" 
        size={40} 
        iconColor='#000000' 
        onPress={() => navigation.navigate("ChooseEventType")}/>
        </View>
      </View>
      <FlatList 
      data={socialEvents}
      renderItem={({item}) => <SocialEventCard event={item} navigation={navigation}/>} 
      extraData={socialEvents.length} 
      keyExtractor={event => event?.eid}
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
      <Stack.Screen name="SocialFeed" component={SocialPostsFeed} />
      <Stack.Screen name="SocialPost" component={SocialPostScreen} />
    </Stack.Navigator>
  );
};
