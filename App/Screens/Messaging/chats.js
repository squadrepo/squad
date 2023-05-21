  import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  Button,
  Appbar
} from "react-native-paper";
import { SafeAreaView, StyleSheet, Image, View, Pressable } from "react-native";
import { UserContext } from "../../Context";
import axios from "axios";

export const Chats = ({ navigation, route }) => {
  const {eventDataSocial, eventDataFood} = route.params ?? {};
  const getChatsUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/getids";
  const { uid, chatroomCids, pfpUr } = useContext(UserContext);

  useEffect(() => {
    //console.log(chatroomCids);

    const fetchMessages = () => {
      getChats();
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [chatroomCids, userChats]);

  const [userChats, setUserChats] = useState([]);

  const getChats = async () => {
    try {
      const response = await axios.get(getChatsUrl, {
        params: {
          chatroomCids: chatroomCids
        }
      });
      //console.log(response.data);
      setUserChats(response.data);
    } catch (error) {
      alert("An error has occurred");

      if (error.response === undefined) {
        throw error;
      }
      const { response } = error;
      //console.log(response.status);
      //console.log(response.data);
    }
  };

  function displayChat(pfp, chat) {
    if (chat.roomName === "") {
      chat.roomName = "Temp Room";
    }
    if (eventDataSocial || eventDataFood) {
      return (
        <Pressable
          style={styles.messageBlock}
          onPress={() =>
            navigation.navigate("ChatRoom", {
              chatroomCID: chat.cid,
              timestamp: chat.chunkCreateTimestamp,
              eventDataSocial: eventDataSocial,
              eventDataFood: eventDataFood
            })
          }
          key={chat.cid}
        >
          <View style={styles.pfpContainer}>
            <Image style={styles.pfp} source={{ uri: pfp }} />
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.name}>{chat.roomName}</Text>
            <Text style={styles.messageStatus}>{chat?.firstMessage?.text}</Text>
          </View>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          style={styles.messageBlock}
          onPress={() =>
            navigation.navigate("ChatRoom", {
              chatroomCID: chat.cid,
              timestamp: chat.chunkCreateTimestamp
            })
          }
          key={chat.cid}
        >
          <View style={styles.pfpContainer}>
            <Image style={styles.pfp} source={pfp && { uri: pfp }} />
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.name}>{chat.roomName}</Text>
            <Text style={styles.messageStatus}>{chat?.firstMessage?.text}</Text>
          </View>
        </Pressable>
      );
    }
  }

  function makeChatList() {
    const chatList = userChats.map((chat) =>
      displayChat("https://squad-app-s3.s3.amazonaws.com/ElMo.jpg", chat)
    );
    return chatList;
  }

  function sharePost() {
    if (eventDataSocial || eventDataFood) {
      return "Share Post"
    } else {
      return "Messages"
    }
    
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
        <Appbar.Content title={sharePost()} />
        <Button
          icon="plus"
          onPress={() => navigation.navigate("MessageOverview")}
        ></Button>
      </Appbar.Header>

      <SafeAreaView style={styles.container}>{makeChatList()}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexDirection: "column",
    backgroundColor: "white"
  },

  messageBlock: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 85
  },

  pfpContainer: {
    alignItems: "center",
    alignSelf: "center",
    paddingLeft: 10,
    width: 80,
    height: 80
  },

  pfp: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2
  },

  circle: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    backgroundColor: "black"
  },

  infoBlock: {
    flexDirection: "column",
    padding: 10
  },

  name: {
    fontWeight: "600",
    fontSize: 16,
    padding: 5
  },

  messageStatus: {
    fontWeight: "300",
    color: "grey",
    fontSize: 16,
    padding: 5
  }
});
