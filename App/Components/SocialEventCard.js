import { Text, Card, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getStringDateFromUnix, getStandardPlural } from '../utilities';
import { useState, useContext, useEffect} from 'react';
import { UserContext } from '../Context';
import { BASE_API_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const ACTION_TEXT_VARIANT =  "labelSmall"
const bullet = (<Text variant={ACTION_TEXT_VARIANT} style={{fontWeight: 'bold'}}>· </Text>);


const styles = StyleSheet.create({
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
  coloredText: {
    color: '#9662fc'
  }
})


const SendRSVP = async (uid, eid, tentative, uidRemoved) => {
  try {
    const baseUrl = `${BASE_API_URL}/socialEvent/rsvp`
    const body = {
        "uid": uid,
        "eid": eid,
        "tentative": tentative,
        "uidRemoved": uidRemoved
    };

    const config = { "content-type": "application/json" };
    const response = await axios.post(baseUrl, body, config);
  } catch (error) {
    console.error(error);
  }
};

export const SocialEventCard = ({event, navigation, root}) => {
  const numGoing = event.uidsRsvp.length;
  const numInterested = event.uidsInterested.length;
  const numComments = event.comments.length;
  const eid = event.eid 
  const uri = (event.bannerUrl && event.bannerUrl.length > 0)
    ? event.bannerUrl 
    : "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png";
    const [yesButtonMode, setYesButtonMode] = useState("outlined");
    const [maybeButtonMode, setMaybeButtonMode] = useState("outlined");
    const { uid } = useContext(UserContext);
    const [yesRemoval, setYesRemoval] = useState(false);
    const [maybeRemoval, setMaybeRemoval] = useState(false);
    
    useEffect(() => {
      uid;
    }, [uid]);

    useEffect(() => {
      const checkIfEidInRsvp = async () => {
        try {
          const valueYes = await AsyncStorage.getItem(eid + "_Yes");
          const valueMaybe = await AsyncStorage.getItem(eid + "_Maybe");
          if (valueYes == "contained") {
            setYesButtonMode("contained")
            setYesRemoval(true); 
          } else if (valueMaybe == "contained") {
            setMaybeButtonMode("contained")
            setMaybeRemoval(true); 
          } 
          else {
            setYesButtonMode("outlined")
            setYesRemoval(false); 
            setMaybeButtonMode("outlined")
            setMaybeRemoval(false); 
          }
        } catch (error) {
          console.log(error);
        }
      };
      
      checkIfEidInRsvp();
    }, [eid]);

    
    const handleYesButtonPress = async () => {
      SendRSVP(uid, eid, tentative = false, uidRemoved = yesRemoval)
      if (yesButtonMode == "outlined" && maybeButtonMode == "outlined") { // if yes button and maybe button are not selected
        setYesButtonMode("contained");
        setMaybeButtonMode("outlined");
        setYesRemoval(true);
        await AsyncStorage.setItem(eid + "_Yes", "contained");
      } else if (maybeButtonMode == "contained") {                       // if maybe is selected and user shifts to yes  
          setMaybeButtonMode("outlined");
          setYesButtonMode("contained");
          setYesRemoval(true);
          setMaybeRemoval(false); 
          await AsyncStorage.setItem(eid + "_Yes", "contained");
          await AsyncStorage.removeItem(eid + "_Maybe");
      } else {                                                          // if user wants to remove their yes rsvp
        setYesButtonMode("outlined");
        setYesRemoval(false); 
        await AsyncStorage.removeItem(eid + "_Yes");
      };      
    };
    
    const handleMaybeButtonPress = async () => {
      SendRSVP(uid, eid, tentative = true, uidRemoved = maybeRemoval)
      if (maybeButtonMode == "outlined" && yesButtonMode == "outlined") {  // if yes button and maybe button are not selected
        setYesButtonMode("outlined");
        setMaybeButtonMode("contained");
        setMaybeRemoval(true);
        await AsyncStorage.setItem(eid + "_Maybe", "contained");
      } else if (yesButtonMode == "contained") {                           // if yes is selected and user shifts to maybe 
        setMaybeButtonMode("contained");
        setYesButtonMode("outlined");
        setYesRemoval(false);
        setMaybeRemoval(true); 
        await AsyncStorage.removeItem(eid + "_Yes");
        await AsyncStorage.setItem(eid + "_Maybe", "contained");
    } else {                                                               // if user wants to remove their maybe rsvp          
        setMaybeButtonMode("outlined");
        setMaybeRemoval(false);
        await AsyncStorage.removeItem(eid + "_Maybe"); 
      };  
    };

  return (
  <Card style={styles.card} onPress={() =>
            navigation.navigate('SocialPost', {event: event, root: root})}>
    <Card.Cover source={{ uri: uri }}/>
    <Card.Title title={event.eventName} titleStyle={styles.eventNameText} subtitle={getStringDateFromUnix(event.eventTimestamp)}/>
    <Card.Content style={styles.cardContent}>
      <Text style={{width: 120}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT} style={styles.coloredText}>{numGoing} student{getStandardPlural(numGoing)} going</Text>
      </Text>
      <Text style={{width: 100}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT} style={styles.coloredText}>{numInterested} interested</Text>
      </Text>
      <Text style={{width: 100}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT}>{numComments} comment{getStandardPlural(numComments)}</Text>
      </Text>
    </Card.Content>
    <Card.Actions>
        <Button mode = {yesButtonMode} onPress={handleYesButtonPress} >Yes</Button>
        <Button mode = {maybeButtonMode} onPress={handleMaybeButtonPress} >Maybe</Button>
    </Card.Actions>
  </Card>
)};