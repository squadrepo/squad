import React, { useState } from "react";
import { TextInput, Button, Text, Appbar, List } from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { UserContext } from "../../Context";
import { BASE_API_URL } from "../../constants";

export const MessageOverview = ({ navigation }) => {
  const [userQuery, setUserQuery] = useState("");
  const [queriedUser, setQueriedUser] = useState("");
  const [queriedUserFullName, setQueriedUserFullName] = useState("");
  const [queriedUserUsername, setQueriedUserUsername] = useState("");
  const [queriedUserPFP, setQueriedUserPFP] = useState("");
  const [checked, setChecked] = useState(false);
  const [users, setUsers] = useState([]);

  const getUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/getUid?username=";

  const getUserUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=";

  const { uid } = React.useContext(UserContext);
  React.useEffect(() => {
    uid;
  }, [uid]);

  React.useEffect(() => {
    console.log(userQuery);
    console.log(checked);
    console.log(users);
    searchForUser();
  }, [userQuery, checked, users]);

  const searchForUser = async () => {
    try {
      // GET request for user info
      const response = await axios.get(`${BASE_API_URL}/account/getUid?username=${userQuery}`);
      console.log(response.data);
      setQueriedUser(response.data.uid);
      getUserInfo(response.data.uid);
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = error;
      return console.log(`${response.status}: ${response.data}`);
    }
  };

  const getUserInfo = (user) => {
    try {
      // GET request for user info
      axios.get(`${getUserUrl}${user}`).then((response) => {
        //console.log(response.data.fullName);
        console.log("succesfully got users info");
        setQueriedUserFullName(response.data.fullName);
        setQueriedUserUsername(response.data.username);
        setQueriedUserPFP(response.data.pfpUrl);
      });
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = error;
      return console.log(`${response.status}: ${response.data}`);
    }
  };

  const setCheckedHandler = async () => {
    setChecked(!checked);
    console.log("checking");
    if (checked) {
      const newUser = {
        uid: queriedUser,
        fullName: queriedUserFullName,
        username: queriedUserUsername
      };
      setUsers([...users, newUser]);
    } else if (!checked) {
      const indexToDelete = users.findIndex(
        (user) => user.uid === `${queriedUser}`
      );
      if (indexToDelete !== -1) {
        users.splice(indexToDelete, 1);
      }
    }
  };

  const convertUsersToJSON = () => {
    if (users.length > 0) {
      const stringUser = JSON.stringify(users);
      const newUserObject = JSON.parse(stringUser);
      console.log(" FULLNAME : ", newUserObject[0].fullName);
      return newUserObject;
    }
  };

  const getNamesFromUserJSON = () => {
    if (users.length > 0) {
      const userJSON = convertUsersToJSON();
      var usersToMessage = "to: ";
      for (let i = 0; i < users.length; i++) {
        usersToMessage += userJSON[i].fullName;
        usersToMessage += " ";
        console.log(userJSON[i]["fullName"]);
      }
      return JSON.stringify(usersToMessage);
    }
  };

  const setUserQueryHandler = (text) => {
    setChecked(false);
    setUserQuery(text);
  };

  const sendFirstMessage = async (currentuser_uid, users) => {
    const allMemberUids = users.map((user) => user.uid);
    console.log("ALL USERS UID: ", allMemberUids);

    const allMemberNamesString = users.map((user) => user.username).join(", ");
    console.log(allMemberNamesString);

    try {
      const baseUrl =
        "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/createChatroom";
      const body = {
        roomName: allMemberNamesString, //update based on thr roomname created
        memberUids: allMemberUids,
        requesterUid: currentuser_uid
      };

      const config = { "content-type": "application/json" };
      const response = await axios.post(baseUrl, body, config);
      navigation.navigate("ChatRoom", {
        chatroomCID: response.data.chatroomCid,
        timestamp: response.data.timestamp
      });
      //console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Chats")} />
        <Appbar.Content title="New Message" />
        <Button
          onPress={() => {
            sendFirstMessage(uid, users);
            console.log(uid);
            console.log(users);
          }}
        >
          chat
        </Button>
      </Appbar.Header>
      <Text>{getNamesFromUserJSON()}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        //clearButtonMode="always"
        //onChangeText={(text) => setUserQuery(text)}
        onChangeText={(text) => setUserQueryHandler(text)}
        placeholder="Search"
        style={{ backgroundColor: "#fff", paddingHorizontal: 20 }}
      />
      <View>
        <TouchableOpacity
          onPress={setCheckedHandler}
          style={
            //checked === true ? { backgroundColor: "rgb(200,175,227)" } : {}
            users.some((user) => user.uid === `${queriedUser}`) === true
              ? { backgroundColor: "rgb(200,175,227)" }
              : {}
          }
        >
          <List.Item
            title={queriedUserFullName}
            description={queriedUserUsername}
            left={() => (
              <List.Icon
                icon={() => (
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={queriedUserPFP && { uri: queriedUserPFP }}
                  />
                )}
              />
            )}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
