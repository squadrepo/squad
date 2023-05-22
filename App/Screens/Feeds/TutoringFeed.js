import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../Context';
import { BASE_API_URL } from '../../constants';
import axios from 'axios';
import { Button, Text, IconButton } from "react-native-paper";
import { FlatList, ScrollView, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { feedStyles as styles } from './FeedStyles';
import { TutorProfileCard } from '../../Components/TutorProfileCard';
import { TutorProfile } from '../Tutoring/TutorProfile';

const subjects = [
  "Accounting",
  "Anthropology",
  "Biology",
  "Business",
  "Chemistry",
  "Communication",
  "Computer Science",
  "Creative Writing",
  "Dance",
  "Data Science",
  "Economics",
  "Education",
  "English",
  "Environmental Science",
  "Film Studies",
  "Finance",
  "Fine Arts",
  "Foreign Languages",
  "Geography",
  "Geology",
  "Graphic Design",
  "History",
  "Journalism",
  "Management",
  "Marketing",
  "Mathematics",
  "Media Studies",
  "Music",
  "Philosophy",
  "Physics",
  "Political Science",
  "Psychology",
  "Sociology",
  "Statistics",
  "Theater"
];

export const TutoringFeed = () => {
  const Stack = createNativeStackNavigator();
  const { univ } = useContext(UserContext);

  const SubjectFeed = ({navigation}) => {
    const handleSubjectPress = (subject) => {
      navigation.navigate('TutorFeed', {subject: subject, univ: univ})
    }
    return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="headlineMedium" style={styles.topBarText}> Pick a Subject for Tutoring</Text>
        <View style={styles.plusButton}>
        <IconButton 
        icon="plus" 
        size={40} 
        iconColor='#000000' 
        onPress={() => navigation.navigate("ChooseEventType")}/>
      </View>
      </View>
      <ScrollView>
        {subjects.map((subject, index) => (<Button key={index} labelStyle={{fontSize: 20}}onPress={() => handleSubjectPress(subject)}>{subject}</Button>))}
      </ScrollView>
    </View>
    );
  }

  const TutorFeed = ({navigation, route}) => {
    const {subject, univ} = route.params;
    const [tutorProfiles, setTutorProfiles] = useState([]);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
      const getTutors = async () => {
        try {
          if (!univ) return;
          setIsFetching(true);
          const response = await axios.get(`${BASE_API_URL}/tutoring/viewfeed?subject=${subject}&universityName=${univ}`);
          const tutors = response.data;
          setTutorProfiles(tutors);
          setIsFetching(false);
        } catch (error) {
          setIsFetching(false);
          if (error.response == undefined) throw error;
          const { response } = error;
          console.log(`${response.status}:`, response.data);
        }
      };

      getTutors();
    }, [triggerFetch]);

    const onRefresh = () => {
      setTriggerFetch(!triggerFetch);
      setIsFetching(true);
    }

    return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{flexDirection: "column"}}>
          <Text variant="headlineMedium" style={styles.topBarText}>Pick a Tutor for {subject}</Text>
          <Text variant="headlineMedium" style={{...styles.topBarText, paddingLeft: 18}}>at {univ}</Text>
        </View>
        <View style={styles.plusButton}>
        <IconButton 
        icon="plus" 
        size={40} 
        iconColor='#000000' 
        onPress={() => navigation.navigate("ChooseEventType")}/>
        </View>
      </View>
      { !isFetching && tutorProfiles.length === 0 
      ? 
        <Text style={{ paddingTop:200, fontSize: 28, color: 'black', textAlign: 'center' }}>No Tutors Found</Text>
      :
        <FlatList 
          data={tutorProfiles}
          renderItem={({item}) => <TutorProfileCard tutorProfile={item} navigation={navigation}/>} 
          extraData={tutorProfiles.length} 
          keyExtractor={(item, index) => index}
          onRefresh={onRefresh}
          refreshing={isFetching}/>
      }
    </View>

    );
  }

  return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SubjectFeed" component={SubjectFeed} />
    <Stack.Screen name="TutorFeed" component={TutorFeed} />
    <Stack.Screen name="TutorProfile" component={TutorProfile} />
  </Stack.Navigator>
  );
};