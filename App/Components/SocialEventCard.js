import { Text, Card } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getStringDateFromUnix, getStandardPlural } from '../utilities';

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

export const SocialEventCard = ({event, navigation, root}) => {
  const numGoing = event.uidsRsvp.length;
  const numInterested = event.uidsInterested.length;
  const numComments = event.comments.length;
  const uri = (event.bannerUrl && event.bannerUrl.length > 0)
    ? event.bannerUrl 
    : "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png";
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
  </Card>
)};