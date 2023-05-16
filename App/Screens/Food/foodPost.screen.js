import { Text, Appbar, Button } from 'react-native-paper';
import { View, ScrollView, Image, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import { CommentsSection } from '../../Components/CommentsSection';
import { getStringDateFromUnix, getStringTimeFromUnix, parseStringSet } from '../../utilities';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';

export const FoodPostScreen = ({navigation, route}) => {
  const {hashKey, rangeKey} = route.params;
  const [event, setEvent] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { uid, fullName, pfpUrl } = useContext(UserContext);

  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);
  const [thumbsUpCount, setThumbsUpCount] = useState(0);
  const [thumbsDownSelected, setThumbsDownSelected] = useState(false);
  const [thumbsDownCount, setThumbsDownCount] = useState(0);
  const [comments, setComments] = useState([]);

  const isLoaded = event?.address !== undefined;
  const deviceWidth = Dimensions.get('window').width;
  const startTimeStamp = event?.startEndTimestamp && event.startEndTimestamp.length >= 1 ? event.startEndTimestamp[0] : 0;
  const endTimeStamp = event?.startEndTimestamp && event.startEndTimestamp.length >= 2 ? event.startEndTimestamp[1] : 0;
  const isMultiDay = Boolean(Math.floor(startTimeStamp / 86400) !== Math.floor(endTimeStamp / 86400));

  useEffect(() => {
    const getEvent = async () => {
      setIsRefreshing(true);
      try {
        const response = await axios.get(`${BASE_API_URL}/foodEvent/getdetails?hashKey=${hashKey}&rangeKey=${rangeKey}`);
        setEvent({...response.data, rating: {up: parseStringSet(response?.data?.rating?.up), down: parseStringSet(response?.data?.rating?.down)}});
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
    setThumbsUpSelected(event?.rating?.up?.includes(uid));
    setThumbsUpCount(event?.rating?.up?.length ?? 0);
    setThumbsDownSelected(event?.rating?.down?.includes(uid));
    setThumbsDownCount(event?.rating?.down?.length ?? 0);
    setComments(event?.comments);
}, [event]);


  const handleThumbsUpPress = async () => {
    // Update UI for crisp response time, then post to update server
    setThumbsUpSelected(!thumbsUpSelected);
    setThumbsDownSelected(false);

    setThumbsUpCount(thumbsUpSelected ? thumbsUpCount - 1 : thumbsUpCount + 1);
    if (thumbsDownSelected) setThumbsDownCount(thumbsDownCount - 1);

    try {
      await axios.post(`${BASE_API_URL}/foodEvent/rate`, 
        {
          hashKey: hashKey,
          rangeKey: rangeKey,
          rating: "up",
          uid: uid
        });
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = error;
      console.log(`${response.status}: `, response.data);
    }
  };
  
  const handleThumbsDownPress = async () => {
    // Update UI for crisp response time, then post to update server
    setThumbsDownSelected(!thumbsDownSelected);
    setThumbsUpSelected(false);

    setThumbsDownCount(thumbsDownSelected ? thumbsDownCount - 1 : thumbsDownCount + 1);
    if (thumbsUpSelected) setThumbsUpCount(thumbsUpCount - 1);

    try {
      await axios.post(`${BASE_API_URL}/foodEvent/rate`, 
        {
          hashKey: hashKey,
          rangeKey: rangeKey,
          rating: "down",
          uid: uid
        });
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = error;
      console.log(`${response.status}: `, response.data);
    }
  };

  const handleShareButtonPress = () => {
    console.log("Shared")
  };

  const postComment = async (newCommentText) => {
    if (newCommentText === "") return;
    try {
      await axios.post(`${BASE_API_URL}/foodEvent/comment`, 
        {
          hashKey: hashKey,
          rangeKey: rangeKey,
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
        <Appbar.Content title="Back" />
      </Appbar.Header>
      <ScrollView 
        contentContainerStyle={{ ...styles.verticalFlex, alignItems: "center", paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => setTriggerRefresh(!triggerRefresh)}/>}
        keyboardShouldPersistTaps='handled'
        >

        { /* This gives us a 16/9 container at 96% of the device's width that the image fills evenly */ }
        <View style={{ width: deviceWidth * 0.96, height: deviceWidth * .54 }}>
            {event?.bannerUrl && (<Image style={{flex: 1, width: undefined, height: undefined}} source={{ uri: event?.bannerUrl }}/>)}
        </View>

        {isLoaded && (
          <View style={{ ...styles.verticalFlex, alignItems: "flex-start", padding: 0, margin: 0, width: deviceWidth * 0.92 }}>
              <Text style={{ fontSize: 28, color: "black", textAlign: "left", paddingTop: 20, fontWeight: "bold" }}>
                  {event?.eventName ?? ""}
              </Text>
              <Text style={{ fontSize: 14, color: "black", textAlign: "left", fontStyle: "italic", paddingBottom: 10}}>
                  Posted by {event?.fullName ?? ""}
              </Text>

              <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                  <Text style={{ fontWeight: "bold"}}>
                      Date:
                  </Text>
                  <Text>
                      {` ${getStringDateFromUnix(startTimeStamp)}`}{isMultiDay && ` – ${getStringDateFromUnix(endTimeStamp)} `}
                  </Text>
              </Text>

              <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                  <Text style={{ fontWeight: "bold"}}>
                      Time:
                  </Text>
                  <Text>
                      {` ${getStringTimeFromUnix(startTimeStamp)}`} &mdash; {`${getStringTimeFromUnix(endTimeStamp)} `}
                  </Text>
              </Text>

              <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                  <Text style={{ fontWeight: "bold"}}>
                      Location:
                  </Text>
                  <Text>
                      {` ${event?.address}`}
                  </Text>
              </Text>

              <Text style={{ fontSize: 18, color: "black", textAlign: "left", }}>
                  <Text style={{ fontWeight: "bold"}}>
                      Requirements:
                  </Text>
                  <Text>
                      {` ${event?.requirements}`}
                  </Text>
              </Text>

              <Text style={{ fontSize: 18, color: "black", textAlign: "left", paddingTop: 15, paddingBottom: 15 }}>
                  {event?.desc}
              </Text>

              <View style={{...styles.horizontalFlex, justifyContent: "space-evenly", borderBottomWidth: 1, borderTopWidth: 1, borderColor: "#999999", borderStyle: "solid", width: deviceWidth * 0.92, paddingTop: 10, paddingBottom: 10}}>
                  <View style={{...styles.horizontalFlex}}>
                      <Button style={{width: 80}} mode={thumbsUpSelected ? "contained" : "outlined"} onPress={handleThumbsUpPress} icon="thumb-up">
                          {thumbsUpCount}
                      </Button>
                  </View>
                  <View style={{...styles.horizontalFlex}}>
                      <Button style={{width: 80}} mode={thumbsDownSelected ? "contained" : "outlined"} onPress={handleThumbsDownPress}  icon="thumb-down">
                          {thumbsDownCount}
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
        )}

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
});