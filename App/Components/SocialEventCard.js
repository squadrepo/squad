import { Text, Card, Button, IconButton, Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getStringDateTimeFromUnix, getStandardPlural, parseStringSet } from '../utilities';
import { useState, useContext, useEffect} from 'react';
import { UserContext } from '../Context';
import { BASE_API_URL } from '../constants';
import axios from 'axios';


const ACTION_TEXT_VARIANT = "labelSmall"
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
    fontSize: 22
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
  },
  coloredText: {
    color: '#9662fc'
  }
})


const SendRSVP = async (uid, eid, tentative) => {
  try {
    const baseUrl = `${BASE_API_URL}/socialEvent/rsvp`
    const body = {
        "uid": uid,
        "eid": eid,
        "tentative": tentative
    };

    const config = { "content-type": "application/json" };
    await axios.post(baseUrl, body, config);
  } catch (error) {
    if (error.response == undefined) throw error;
    const { response } = error;
    console.log(`${response.status}: `, response.data);
  }
};

export const SocialEventCard = ({event, navigation}) => {
  const numComments = event.comments.length;
  const [isGoingSelected, setIsGoingSelected] = useState(false);
  const [goingCount, setGoingCount] = useState(parseStringSet(event.uidsRsvp).length);
  const [isInterestedSelected, setIsInterestedSelected] = useState(false);
  const [interestedCount, setInterestedCount] = useState(parseStringSet(event.uidsInterested).length);
  const eid = event.eid 
  const uri = (event.bannerUrl && event.bannerUrl.length > 0)
    ? event.bannerUrl 
    : "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png";
  const { uid } = useContext(UserContext);
  
  useEffect(() => {
    setIsGoingSelected(event.uidsRsvp.includes(uid));
    setIsInterestedSelected(event.uidsInterested.includes(uid));
  }, [uid]);

  const handleGoingPress = async () => {
    // Update UI for crisp response time, then post to update server
    setIsGoingSelected(!isGoingSelected);
    setIsInterestedSelected(false);

    setGoingCount(isGoingSelected ? goingCount - 1 : goingCount + 1);
    if (isInterestedSelected) setInterestedCount(interestedCount - 1);

    SendRSVP(uid, eid, tentative = false);
  };
  
  const handleInterestedPress = async () => {
    setIsInterestedSelected(!isInterestedSelected);
    setIsGoingSelected(false);

    setInterestedCount(isInterestedSelected ? interestedCount - 1 : interestedCount + 1);
    if (isGoingSelected) setGoingCount(goingCount - 1);

    SendRSVP(uid, eid, tentative = true);
  };

  return (
  <Card style={styles.card} onPress={() =>
            navigation.navigate('SocialPost', {univAssoc: event.univAssoc, eid: event.eid})}>
    <Card.Cover source={{ uri: uri }}/>
    <Card.Title title={event.eventName} titleStyle={styles.eventNameText} subtitle={getStringDateTimeFromUnix(event.eventTimestamp)} right={(props) => <Avatar.Icon icon="account-group" size={50} color="#57319e" style={{backgroundColor: "#00000000"}}/>}/>
    <Card.Content style={styles.cardContent}>
      <Text style={{width: 120}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT} style={styles.coloredText}>{goingCount} student{getStandardPlural(goingCount)} going</Text>
      </Text>
      <Text style={{width: 100}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT} style={styles.coloredText}>{interestedCount} interested</Text>
      </Text>
      <Text style={{width: 100}}>
        {bullet}
        <Text variant={ACTION_TEXT_VARIANT}>{numComments} comment{getStandardPlural(numComments)}</Text>
      </Text>
    </Card.Content>
    <Card.Actions>
        <Button style={{ borderWidth: 1 }} mode={isGoingSelected ? "contained" : "outlined"} onPress={handleGoingPress} icon="calendar-check" > Going </Button>
        <Button style={{ borderWidth: 1 }} mode={isInterestedSelected ? "contained" : "outlined"} onPress={handleInterestedPress} icon="calendar-minus"> Maybe</Button>
    </Card.Actions>
  </Card>
)};