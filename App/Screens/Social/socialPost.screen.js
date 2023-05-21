import { Text, Appbar, Button } from 'react-native-paper';
import { View, ScrollView, Image, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import { CommentsSection } from '../../Components/CommentsSection';
import { getStringDateFromUnix, getStringTimeFromUnix, parseStringSet } from '../../utilities';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SocialPostScreen = ({navigation, route}) => {
  const {univAssoc, eid} = route.params;
  const [event, setEvent] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [comments, setComments] = useState([]);


  useEffect(() => {
    const getEvent = async () => {
      setIsRefreshing(true);
      try {
        const response = await axios.get(`${BASE_API_URL}/socialEvent/details?univAssoc=${univAssoc}&eid=${eid}`);
        setEvent(response.data);
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = error;
        console.log(`${response.status}: `, response.data);
      }
      setIsRefreshing(false);
    };
    getEvent();
  }, [triggerRefresh]);

  useEffect(() => {
    if (!isLoaded) return;
    console.log(event);
    setComments(event?.comments);
}, [event]);

  const isLoaded = event?.streetAddress !== undefined;
  const deviceWidth = Dimensions.get('window').width;

  const bullet = (<Text style={{fontWeight: 'bold', fontSize: 18}}>· </Text>);

  const { uid, fullName, pfpUrl } = useContext(UserContext);
  const [isGoingSelected, setIsGoingSelected] = useState(false);
  const [goingCount, setGoingCount] = useState(0);
  const [isInterestedSelected, setIsInterestedSelected] = useState(false);
  const [interestedCount, setInterestedCount] = useState(0);

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


    useEffect(() => {
      if (!isLoaded) return;
      console.log(event);
      setIsGoingSelected(event?.uidsRsvp?.includes(uid));
      setGoingCount(parseStringSet(event?.uidsRsvp)?.length ?? 0);
      setIsInterestedSelected(event?.uidsInterested?.includes(uid));
      setInterestedCount(parseStringSet(event?.uidsInterested)?.length ?? 0);
      setComments(event?.comments);
  }, [event]);
    
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

  const handleShareButtonPress = () => {
    navigation.navigate("Chats", {eventDataSocial : event});
  };

  const postComment = async (newCommentText) => {
    if (newCommentText === "") return;
    try {
      await axios.post(`${BASE_API_URL}/socialEvent/comment`, 
        {
          univAssoc: univAssoc,
          createTimestamp: event.createTimestamp,
          commenterUid: uid,
          commentText: newCommentText
        });
      setComments([...event.comments, 
        {
          commentText: newCommentText, 
          commenterUid: uid,
          fullName: fullName,
          pfpUrl: pfpUrl,
          createTimestamp: Date.now() / 1000,
          attachmentUrls: [""]
        }]);
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = error;
      console.log(`${response.status}: `, response.data);
    }
  };

  // ScrollView's refreshControl for pull to refresh
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Back to Feed" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ ...styles.verticalFlex, alignItems: "center", paddingBottom: 100 }}
                  refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => setTriggerRefresh(!triggerRefresh)}/>}
                  keyboardShouldPersistTaps='handled'>

        { /* This gives us a 16/9 container at 96% of the device's width that the image fills evenly */ }
        <View style={{ width: deviceWidth * 0.96, height: deviceWidth * .54 }}>
            {event?.bannerUrl && (<Image style={{flex: 1, width: undefined, height: undefined}} source={{ uri: event?.bannerUrl }}/>)}
        </View>

        <View style={{ ...styles.verticalFlex, alignItems: "flex-start", padding: 0, margin: 0, width: deviceWidth * 0.92 }}>
            <Text style={{ fontSize: 28, color: "black", textAlign: "left", paddingTop: 20, fontWeight: "bold" }}>
                {event?.eventName ?? ""}
            </Text>
            <Text style={{ fontSize: 14, color: "black", textAlign: "left", fontStyle: "italic", paddingBottom: 10}}>
                Posted by {event?.fullName ?? event?.posterUid ?? ""}
            </Text>
            <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                <Text style={{ fontWeight: "bold"}}>
                    Date:
                </Text>
                <Text>
                    {isLoaded && ` ${getStringDateFromUnix(event?.eventTimestamp) ?? ""}`}
                </Text>
            </Text>
            <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                <Text style={{ fontWeight: "bold"}}>
                    Time:
                </Text>
                <Text>
                    {isLoaded && ` ${getStringTimeFromUnix(event.eventTimestamp)}`}
                </Text>
            </Text>
            <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                <Text style={{ fontWeight: "bold"}}>
                    Location:
                </Text>
                <Text>
                    {isLoaded && ` ${event?.streetAddress}, ${event?.city}, ${event?.state} ${event?.zip}`}
                </Text>
            </Text>
            <Text style={{ fontSize: 18, color: "black", textAlign: "left", paddingTop: 15, paddingBottom: 15 }}>
                {event?.desc}
            </Text>

            <View style={{...styles.horizontalFlex, paddingBottom: 10}}>
                <Text style={styles.coloredTextHolder}>
                  {bullet}
                  <Text style={styles.coloredText}>{`${goingCount ?? 0} going`}</Text>
                </Text>
                <Text style={styles.coloredTextHolder}>
                  {bullet}
                  <Text style={styles.coloredText}>{interestedCount ?? 0} interested</Text>
                </Text>
            </View>

            <View style={{...styles.horizontalFlex, justifyContent: "space-evenly", borderBottomWidth: 1, borderTopWidth: 1, borderColor: "#999999", borderStyle: "solid", width: deviceWidth * 0.92, paddingTop: 10, paddingBottom: 10}}>
                <View style={{...styles.horizontalFlex}}>
                    <Button style={{ borderWidth: 1 }} mode={isGoingSelected ? "contained" : "outlined"} onPress={handleGoingPress} icon="calendar-check" >
                       Going 
                    </Button>
                </View>
                <View style={{...styles.horizontalFlex}}>
                    <Button style={{ borderWidth: 1 }} mode={isInterestedSelected ? "contained" : "outlined"} onPress={handleInterestedPress} icon="calendar-minus">
                        Maybe
                    </Button>
                </View>
                <View style={{...styles.horizontalFlex}}>
                    <Button mode="outlined" onPress={handleShareButtonPress}  icon="share-outline">
                        Share
                    </Button>
                </View>
            </View>

            <CommentsSection comments={comments} postFunction={postComment}/>
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
    fontSize: 14
  },
  coloredTextHolder: {
    paddingRight: 10
  }
})