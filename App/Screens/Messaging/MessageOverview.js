import * as React from "react";
import { TextInput, Button, Text, Appbar, List } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";
import axios from "axios";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { withAuthenticator } from "aws-amplify-react-native";

export const MessageOverview = ({ navigation }) => {
  const [userQuery, setUserQuery] = React.useState("");
  const [queriedUser, setQueriedUser] = React.useState("");
  const [queriedUserFullName, setQueriedUserFullName] = React.useState("");
  const [queriedUserUsername, setQueriedUserUsername] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  const getUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/getUid?username=";

  const getUserUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=";

  React.useEffect(() => {
    console.log(userQuery);
    console.log(checked);
    console.log(users);
    searchForUser();
  }, [userQuery, checked, users]);

  const searchForUser = async () => {
    try {
      // GET request for user info
      axios.get(`${getUrl}${userQuery}`).then((response) => {
        console.log(response.data);
        setQueriedUser(response.data.uid);
        getUser(response.data.uid);
      });
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = errorObj;
      return console.log(`${response.status}: ${response.data}`);
    }
  };

  const getUser = (user) => {
    try {
      // GET request for user info
      axios.get(`${getUserUrl}${user}`).then((response) => {
        //console.log(response.data.fullName);
        console.log("succesfully got users info");
        setQueriedUserFullName(response.data.fullName);
        setQueriedUserUsername(response.data.username);
      });
    } catch (error) {
      if (error.response == undefined) throw error;
      const { response } = errorObj;
      return console.log(`${response.status}: ${response.data}`);
    }
  };

  const setCheckedHandler = () => {
    setChecked(!checked);

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
      console.log(" FULLNAME : ", newUserObject[0].uid);
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

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Main")} />
        <Appbar.Content title="New Message" />
        <Button>chat</Button>
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
            users.some((user) => user.uid === `${queriedUser}`) === true ||
            checked === true
              ? { backgroundColor: "rgb(200,175,227)" }
              : {}
          }
        >
          <List.Item
            title={queriedUserFullName}
            description={queriedUserUsername}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
