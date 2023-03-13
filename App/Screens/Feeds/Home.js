import * as React from "react";
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { UserContext } from "../../Context";
import { Auth } from "@aws-amplify/auth";
import axios from "axios";

export const MainFeed = () => {
  const {
    aboutMe,
    setAboutMe,
    chatroomCids,
    setChatroomCids,
    classHist,
    setClassHist,
    dispTags,
    setDispTags,
    dob,
    setDOB,
    email,
    setEmail,
    emailLastVerifiedDate,
    setEmailLastVerifiedDate,
    fullName,
    setFullName,
    pfpUrl,
    setPfpUrl,
    tags,
    setTags,
    tutorRating,
    setTutorRating,
    uid,
    setUid,
    univ,
    setUniv,
    univExclExp,
    setUnivExclExp,
    username,
    setUsername
  } = React.useContext(UserContext);

  //URL used to GET users info
  const getUrl =
    "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=";

  async function getUserUUID() {
    try {
      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();

      // Get the user's UUID
      const userUUID = currentUser.attributes.sub;

      console.log("User UUID:", userUUID);

      return userUUID;
    } catch (error) {
      console.log("Error getting user UUID:", error);
      throw error;
    }
  }

  //This will get the users information and store the info in the correct states
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const UUID = await getUserUUID();
        setUid(UUID);

        // GET request for user info
        axios.get(`${getUrl}${UUID}`).then((response) => {
          console.log(response.data);
          //set user states
          setAboutMe(response.data.aboutMe);
          setChatroomCids(response.data.chatroomCids);
          setClassHist(response.data.classHist);
          setDispTags(response.data.dispTags);
          setDOB(response.data.dob);
          setEmail(response.data.email);
          setEmailLastVerifiedDate(response.data.emailLastVerifiedDate);
          setFullName(response.data.fullName);
          setPfpUrl(response.data.pfpUrl);
          setTags(response.data.tags);
          setTutorRating(response.data.tutorRating);
          setUniv(response.data.univ);
          setUnivExclExp(response.data.univExclExp);
          setUsername(response.data.username);
        });
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };
    getUser();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, color: "black", textAlign: "center" }}>
        {" "}
        Home Page
      </Text>
      <Text>Hi {fullName} !</Text>
    </View>
  );
};
