import React from "react";
import { Button, Appbar} from "react-native-paper";
import { SafeAreaView, View, StyleSheet, Image, Text, TextInput} from "react-native";

export const ProfileViewScreen = ({ navigation }) => {
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
            <Text style={styles.name}>Person Name</Text>
            <Text style={styles.username}>@UserName</Text>
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
        <Text>This is the about me section where you would write about yourself and stuff and yeah there's a text limit. 
          Just testing how far this desc can go and how natural it looks</Text>
      </View>

      <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}></View>

      <View style={styles.tagList}>

        <Text style={styles.categoryText}>Tutoring</Text>
        <View style={styles.tagCategory}>
          <Tag tag={{ name:"Physics" }}/>
          <Tag tag={{ name:"Chemistry" }}/>
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
