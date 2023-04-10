import { Text, Appbar, Button } from 'react-native-paper';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { CommentsSection } from '../../Components/CommentsSection';
import { getStandardPlural, getStringDateFromUnix } from '../../utilities';
import { useState, useContext } from 'react';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';

export const SocialPostScreen = ({navigation, route}) => {
  const {event, root} = route.params;

  const uri = (event.bannerUrl && event.bannerUrl.length > 0)
    ? event.bannerUrl 
    : "https://squad-app-s3.s3.amazonaws.com/VOKOLOS.png";
  const numGoing = event.uidsRsvp.length;
  const numInterested = event.uidsInterested.length;

  const deviceWidth = Dimensions.get('window').width;

  const bullet = (<Text style={{fontWeight: 'bold', fontSize: 18}}>· </Text>);

  const [yesButtonMode, setYesButtonMode] = useState("outlined");
  const [maybeButtonMode, setMaybeButtonMode] = useState("outlined");
  const { uid } = useContext(UserContext);
  const [yesRemoval, setYesRemoval] = useState(false);
  const [maybeRemoval, setMaybeRemoval] = useState(false);

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

  const handleYesButtonPress = () => {
    SendRSVP(uid, event.eid, tentative = false, uidRemoved = yesRemoval)
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
    SendRSVP(uid, event.eid, tentative = true, uidRemoved = maybeRemoval)
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
  

  // ScrollView's refreshControl for pull to refresh
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate(root)} />
        <Appbar.Content title="Back to Feed" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ ...styles.verticalFlex, alignItems: "center", paddingBottom: 100 }}>

        { /* This gives us a 16/9 container at 96% of the device's width that the image fills evenly */ }
        <View style={{ width: deviceWidth * 0.96, height: deviceWidth * .54 }}>
            <Image style={{flex: 1, width: undefined, height: undefined}} source={{ uri: uri }}/>
        </View>

        <View style={{ ...styles.verticalFlex, alignItems: "flex-start", padding: 0, margin: 0, width: deviceWidth * 0.92 }}>
            <Text style={{ fontSize: 28, color: "black", textAlign: "left", paddingTop: 20 }}>
                {event?.eventName ?? ""}
            </Text>
            <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                {getStringDateFromUnix(event.eventTimestamp)}
            </Text>
            <Text style={{ fontSize: 14, color: "black", textAlign: "left", }}>
                from {event?.posterUid ?? ""}
            </Text>
            <Text style={{ fontSize: 18, color: "black", textAlign: "left", paddingTop: 15, paddingBottom: 15 }}>
                {event?.desc}
            </Text>

            <View style={styles.horizontalFlex}>
                <View style={{...styles.verticalFlex, paddingRight: 30}}>
                    <Text>
                      {bullet}
                      <Text style={styles.coloredText}>{numGoing} student{getStandardPlural(numGoing)} going</Text>
                    </Text>
                    <View style={{...styles.horizontalFlex, paddingTop: 10}}>
                        <Button mode = {yesButtonMode} onPress={handleYesButtonPress}>I'm Going</Button>
                    </View>
                </View>

                <View style={styles.verticalFlex}>
                    <Text>
                      {bullet}
                      <Text style={styles.coloredText}>{numInterested} interested</Text>
                    </Text>
                    <View style={{...styles.horizontalFlex, paddingTop: 10}}>
                        <Button mode = {maybeButtonMode} onPress={handleMaybeButtonPress}>Maybe</Button>
                    </View>
                </View>
            </View>

            <CommentsSection comments={event?.comments} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalFlex: {
    display: "flex", 
    flexDirection: "row"
  },
  verticalFlex: {
    display: "flex", 
    flexDirection: "column"
  },
  coloredText: {
    color: '#9662fc',
    fontSize: 18
  }
})