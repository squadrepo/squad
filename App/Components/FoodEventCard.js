import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Card, Avatar, } from 'react-native-paper';
import { getStringDateTimeFromUnix, getStandardPlural, parseStringSet } from '../utilities';
import { DARK_PURPLE } from '../constants';

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
  coloredText: {
    color: DARK_PURPLE,
    fontWeight: "600"
  }
});

export const FoodEventCard = ({event, navigation}) => {
  const numThumbsUp = parseStringSet(event?.rating?.up).length;
  const numThumbsDown = parseStringSet(event?.rating?.down).length;
  const numComments = event?.numComments ?? event?.comments?.length ?? 0;
  const uri = (event?.bannerUrl && event.bannerUrl.length > 0)
    ? event.bannerUrl 
    : "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png";
  const bullet = (<Text style={{fontWeight: 'bold', fontSize: 14}}>· </Text>);  

  return (
  <Card style={styles.card} onPress={() =>
            navigation.navigate('FoodPostScreen', {hashKey: event?.hashKey, rangeKey: event?.rangeKey})}>
    <Card.Cover source={{ uri: uri }}/>
    <Card.Title title={event?.eventName} titleStyle={styles.eventNameText}
        right={(props) => <Avatar.Icon icon="food" size={50} color={DARK_PURPLE} style={{backgroundColor: "#00000000"}}/>}
        subtitle={<Text><Text style={styles.coloredText}>Ends: </Text>{getStringDateTimeFromUnix(event?.startEndTimestamp[1])}</Text>}
        />
    <Card.Content>
        <Text style={{paddingBottom: 10}}><Text style={styles.coloredText}>Address: </Text>{event?.address}</Text>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <View style={{padding: 0, margin: 0}}>
                <Avatar.Icon icon="thumb-up" size={20} color={DARK_PURPLE} style={{backgroundColor: "#00000000"}}/>
            </View>
            <Text variant="labelSmall">{numThumbsUp} | </Text>
            <View style={{padding: 0, margin: 0}}>
                <Avatar.Icon icon="thumb-down" size={20} color={DARK_PURPLE} style={{backgroundColor: "#00000000"}}/>
            </View>
            <Text variant="labelSmall" style={{paddingRight: 30}}>{numThumbsDown}</Text>
             <Text style={{width: 100}}>
                {bullet}
                <Text variant="labelSmall">{numComments} comment{getStandardPlural(numComments)}</Text>
            </Text>
        </View>

    </Card.Content>
  </Card>
)};