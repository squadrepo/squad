import { Text, Appbar, Button } from 'react-native-paper';
import { View, ScrollView, Image, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import { CommentsSection } from '../../Components/CommentsSection';
import { getStringDateFromUnix, getStringTimeFromUnix } from '../../utilities';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SocialPostScreen = ({navigation, route}) => {
  const {univAssoc, eid, root} = route.params;
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

  const [yesButtonMode, setYesButtonMode] = useState("outlined");
  const [maybeButtonMode, setMaybeButtonMode] = useState("outlined");
  const { uid, fullName, pfpUrl } = useContext(UserContext);
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

  const handleShareButtonPress = () => {
    console.log("Shared")
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
        <Appbar.BackAction onPress={() => navigation.navigate(root)} />
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
                  <Text style={styles.coloredText}>{`${event?.uidsRsvp?.length ?? 0} going`}</Text>
                </Text>
                <Text style={styles.coloredTextHolder}>
                  {bullet}
                  <Text style={styles.coloredText}>{event?.uidsInterested?.length ?? 0} interested</Text>
                </Text>
            </View>

            <View style={{...styles.horizontalFlex, justifyContent: "space-evenly", borderBottomWidth: 1, borderTopWidth: 1, borderColor: "#999999", borderStyle: "solid", width: deviceWidth * 0.92, paddingTop: 10, paddingBottom: 10}}>
                <View style={{...styles.horizontalFlex}}>
                    <Button mode={yesButtonMode} onPress={handleYesButtonPress} icon="calendar-check">
                        Going
                    </Button>
                </View>
                <View style={{...styles.horizontalFlex}}>
                    <Button mode={maybeButtonMode} onPress={handleMaybeButtonPress}  icon="calendar-minus">
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