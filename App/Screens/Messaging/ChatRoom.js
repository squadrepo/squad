import React, { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../Context";
import {
  GiftedChat,
  Message as GiftedChatMessage,
  MessageProps,
  IMessage,
  Avatar,
  Bubble,
  InputToolbar
} from "react-native-gifted-chat";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import axios from "axios";
import { HomeFeed } from "../Feeds/HomeFeed";



import { getStringDateFromUnix, getStandardPlural } from '../../utilities';

//Todo
//get timestamp from evan if chat exists or if new chat get it from Dom

export const ChatRoom = ({ navigation, route }) => {
  const { chatroomCID, timestamp, eventDataSocial, eventDataFood } = route.params ?? {};
  //console.log("Params: ", route.params);
  const [messages, setMessages] = useState([]);
  const { uid } = useContext(UserContext);
  useEffect(() => {
    if (eventDataSocial) {
      shareEvent(messages);
    } else if (eventDataFood) {
      shareFood(messages)
    }
    uid;
  }, [uid]);
  const [uidmappings, setUidMappings] = useState({ [uid]: 0 });

  const GetMessages = async () => {
    try {
      const baseUrl =
        "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/prevmsg";
      const response = await axios.get(baseUrl, {
        params: {
          cid: chatroomCID, //use imported cid from dom's screen
          chunkCreateTimestamp: timestamp
        }
      });
      setMessages(ConvertData(response.data));
      //console.log(ConvertData(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const SendMessages = async (messagetext) => {
    try {
      const baseUrl = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/";
      const body = {
        cid: chatroomCID, //use imported cid from dom's screen
        message: {
          attachments: [],
          text: messagetext,
          uidSentBy: uid,
          uidsReadBy: []
        }
      }
      const config = { "content-type": "application/json" };
      const response = await axios.post(baseUrl, body, config);
      console.log("Message Sent!");
      //console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const SendEventMessage = async () => {
    try {
      const baseUrl = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/";
      const body = {
        cid: chatroomCID, //use imported cid from dom's screen
        message: {
          attachments: [JSON.stringify(eventDataSocial)],
          text: "A social event has been shared to the chat",
          uidSentBy: uid,
          uidsReadBy: []
        }
      }
      const config = { "content-type": "application/json" };
      const response = await axios.post(baseUrl, body, config);
      console.log("Message Sent!");
      //console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const SendFoodMessage = async () => {
    try {
      const baseUrl = "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/";
      const body = {
        cid: chatroomCID, //use imported cid from dom's screen
        message: {
          attachments: [JSON.stringify(eventDataFood)],
          text: "A food event has been shared to the chat",
          uidSentBy: uid,
          uidsReadBy: []
        }
      }
      const config = { "content-type": "application/json" };
      const response = await axios.post(baseUrl, body, config);
      console.log("Message Sent!");
      //console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const ConvertData = (oldArray) => {
    const newArray = [];
    var countUser = 1;
    var countMessage = 0;
    oldArray.forEach((subArray) => {
      //console.log("sub", subArray);
      for (let i = subArray.length - 1; i >= 0; i--) {
        const obj = subArray[i];
        const { uidSentBy, ...rest } = obj;

        if (uidmappings[uidSentBy]) {
          setUidMappings({ ...uidmappings, [uidSentBy]: countUser });
        }

        countUser = countUser + 1;
        const date = new Date(rest.timestamp * 1000);
        //console.log(rest.attachments);
        newArray.push({
          _id: countMessage,
          text: rest.text,
          createdAt: date,
          attachments: { event : rest.attachments } ,
          user: {
            _id: uidmappings[uidSentBy],
            name: "React Native"
          }
        });
        countMessage = countMessage + 1;
      }
    });

    return newArray;
  };

  useEffect(() => {
    //GetMessages();
    const fetchMessages = () => {
      GetMessages();
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  const onSend = useCallback((messages = []) => {
    SendMessages(messages[0].text);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const shareEvent = useCallback((messages = []) => {
    SendEventMessage();
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const shareFood = useCallback((messages = []) => {
    SendFoodMessage();
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const renderBubble = (props) => {
    const { currentMessage } = props;
    if (currentMessage.attachments && currentMessage.attachments.event != "") {
      eventDetails = JSON.parse(currentMessage.attachments.event);
      if (eventDetails.univAssoc) {
        currentMessage.attachments["idOne"] = eventDetails.univAssoc;
        currentMessage.attachments["idTwo"] = eventDetails.eid;
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { 
                backgroundColor: "#ceaffa",
                alignItems: 'center',
                justifyContent: 'center' 
              },
              left: { 
                backgroundColor: "#e4e1e8",
                alignItems: 'center', 
                justifyContent: 'center' 
              },
            }}
            onPress={() => navigation.navigate("SocialPost", { univAssoc: currentMessage.attachments.idOne, eid: currentMessage.attachments.idTwo, root: "ChatRoom"})}
          >
            {currentMessage.text = <Text>
              {eventDetails.eventName + '\n' + 
              eventDetails.streetAddress + '\n' +
              getStringDateFromUnix(eventDetails.eventTimestamp)
              }
            </Text>}
          </Bubble>
        );
      } else if (eventDetails.hashKey) {
        currentMessage.attachments["idOne"] = eventDetails.hashKey;
        currentMessage.attachments["idTwo"] = eventDetails.rangeKey;
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { 
                backgroundColor: "#ceaffa",
                alignItems: 'center',
                justifyContent: 'center' 
              },
              left: { 
                backgroundColor: "#e4e1e8",
                alignItems: 'center', 
                justifyContent: 'center' 
              },
            }}
            onPress={() => navigation.navigate('FoodPostScreen', { hashKey: currentMessage.attachments.idOne, rangeKey: currentMessage.attachments.idTwo, root: "ChatRoom"})}
          >
            {currentMessage.text = <Text>
              {eventDetails.eventName + '\n' + 
              eventDetails.address }
            </Text>}
          </Bubble>
        );
      }
      
    }
    else {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: "#ceaffa" },
            left: { backgroundColor: "#e4e1e8" }
          }}
        >
        </Bubble>
      );
    }
  
    return null;
  };

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopLeftRadius: 300,
        borderTopRightRadius: 300,
        borderBottomLeftRadius: 300,
        borderBottomRightRadius: 300
      }}
      primaryStyle={{ alignItems: "center" }}
    />
  );

  const renderAvatar = (props) => {
    if (props.currentMessage.user._id === 0) {
      return null;
    }
    return <Avatar {...props} />;
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: uidmappings[uid],
        name: "Tapasya Sharma"
      }}
      renderBubble={renderBubble}
      renderAvatar={renderAvatar}
      showAvatarForEveryMessage={true}
      renderInputToolbar={renderInputToolbar}
    />
  );
};
