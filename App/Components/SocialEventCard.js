import { Text, Card, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getStringDateFromUnix, getStandardPlural } from '../utilities';
import { useState, useContext, useEffect} from 'react';
import { UserContext } from '../Context';
import { BASE_API_URL } from '../constants';
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
    console.log(response.data);
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
    
    const handleYesButtonPress = () => {
      SendRSVP(uid, eid, tentative = false, uidRemoved = yesRemoval)
      if (yesButtonMode == "outlined" && maybeButtonMode == "outlined") {
        setYesButtonMode("contained");
        setMaybeButtonMode("outlined");
        setYesRemoval(true);
      } else if (maybeButtonMode == "contained") {
          setMaybeButtonMode("outlined");
          setYesButtonMode("contained");
          setYesRemoval(true);
          setMaybeRemoval(false); 
      } else {
        setYesButtonMode("outlined");
        setYesRemoval(false); 
      };      
    };
    
    const handleMaybeButtonPress = () => {
      SendRSVP(uid, eid, tentative = true, uidRemoved = maybeRemoval)
      if (maybeButtonMode == "outlined" && yesButtonMode == "outlined") {
        setYesButtonMode("outlined");
        setMaybeButtonMode("contained");
        setMaybeRemoval(true);
      } else if (yesButtonMode == "contained") {
        setMaybeButtonMode("contained");
        setYesButtonMode("outlined");
        setYesRemoval(false);
        setMaybeRemoval(true); 
    } else {
        setMaybeButtonMode("outlined");
        setMaybeRemoval(false); 
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