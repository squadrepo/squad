/*
Link message button to screens when available
*/

import React from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput} from "react-native";
import { UserContext } from '../../Context';
import { Auth } from '@aws-amplify/auth';
import axios from 'axios';

export const ProfileViewScreen = ({ navigation }) => {

  const {
    aboutMe,
    setAboutMe,
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
    'https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=';

  async function getUserUUID() {
    try {
      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();

      // Get the user's UUID
      const userUUID = currentUser.attributes.sub;

      console.log('User UUID:', userUUID);

      return userUUID;
    } catch (error) {
      console.log('Error getting user UUID:', error);
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

    <View>

      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Person Name" />
        <Button icon="dots-horizontal" onPress={() => console.log('Options open')}></Button>
      </Appbar.Header>

    <SafeAreaView style={styles.container}>

      <View style={styles.profileHeader}>
        <View style={styles.left}>
          <View style={styles.names}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>

          <View style={styles.edit}>
            <Button mode="outlined" onPress={() => console.log('Pressed')}>
             Message
            </Button>
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.profilePic}>
            <Image></Image>
            <View style={styles.circle}></View>
            <Text></Text>
          </View>
        </View>
      
      </View>

      <View style={styles.profileDesc}>
        <Text>{aboutMe}</Text>
      </View>

      <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>

      <View style={styles.tagList}>

        <Text style={styles.categoryText}>Tutoring</Text>
        <View style={styles.tagCategory}>
          <Tag tag={{ name:Array.from(tags)[0] }}/>
          <Tag tag={{ name:Array.from(tags)[1] }}/>
        </View>

        <Text style={styles.categoryText}>Food</Text>
        <View style={styles.tagCategory}>
          <Tag tag={{ name:"Vegetarian" }}/>
        </View>

        <Text style={styles.categoryText}>Social</Text>
        <View style={styles.tagCategory}>
          <Tag tag={{ name:"Walking" }}/>
          <Tag tag={{ name:"Running" }}/>
          <Tag tag={{ name:"Food" }}/>
          <Tag tag={{ name:"Jogging" }}/>
        </View>

        <Text style={styles.categoryText}>Gig-work</Text>
        <View style={styles.tagCategory}>
          <Tag tag={{ name:"Groceries" }}/>
        </View>

      </View>
    </SafeAreaView>
    </View>
  );
};

const Tag = ({ tag }) => <View style={styles.tag}><Button mode="outlined" onPress={() => console.log('Pressed')}>#{tag.name}</Button></View>;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "white",
  },

  profileHeader: {
    flexDirection: "row",
    justifyContent: "center",
  },

  left: {
    alignSelf: "center",
    alignItems: "center",
  },

  names: {
  },

  name: {
    fontWeight: "600",
    fontSize: 20,
  },

  username: {
    fontWeight: '300',
    color: "grey",
    fontSize: 14
  },

  edit: {
    padding: 10,
  },

  right: {
    alignSelf: "center",
    alignItems: "center",
    padding: 10,
  },

  profilePic: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
  },

  circle: {
    width: 180, 
    height: 180, 
    borderRadius: 180/2, 
    backgroundColor: 'black',
  },

  profileDesc: {
    padding: 15,
  },

  tagList: {
    padding: 10,
    paddingLeft: 15,
    alignSelf: 'flex-start',
  },

  categoryText: {
    fontSize: 16, 
    paddingBottom: 8
  },

  tagCategory: {
    flexDirection: "row",
    paddingBottom: 5,
    flexWrap: "wrap",
  },

  tag: {
    paddingLeft: 2,
    paddingBottom: 5,
  },
});
