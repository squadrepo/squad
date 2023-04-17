import React from 'react';
import { FoodPostScreen } from '../Food/foodPost.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';



export const FoodFeed = () => {
    const Stack = createNativeStackNavigator();

    const FoodPostFeed = ({navigation}) => {
      return (<Button style={{paddingTop: 100}} onPress={() => navigation.navigate('FoodScreen', {hashKey: "99278", rangeKey: "e39af235-3a15-4bc8-a9c5-bc534edc039b", root: "FoodFeed"})}>Hello</Button>);
    }

    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FoodFeed" component={FoodPostFeed} />
      <Stack.Screen name="FoodScreen" component={FoodPostScreen} />
    </Stack.Navigator>
  );
};