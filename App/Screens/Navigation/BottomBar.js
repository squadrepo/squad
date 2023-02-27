import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MainFeed } from '../Feeds/Home';
import { SocialFeed } from '../Feeds/SocialFeed';
import { FoodFeed } from '../Feeds/FoodFeed';
import { TutoringFeed } from '../Feeds/TutoringFeed';
import { GigWorkFeed } from '../Feeds/GigworkFeed';
import { Portal, FAB } from 'react-native-paper';



const Tab = createMaterialBottomTabNavigator();

export const Tabs = () => {
    return (
      <React.Fragment>
        <Tab.Navigator
        shifting={true}
        sceneAnimationEnabled={true}
        >
            <Tab.Screen 
            name="Home" 
            component={MainFeed}
            options={{
                tabBarIcon: 'home',
              }}/> 
            <Tab.Screen 
            name="Social" 
            component={SocialFeed}
            options={{
                tabBarIcon: 'account-group',
              }}/> 
            <Tab.Screen 
            name="Food" 
            component={FoodFeed}
            options={{
                tabBarIcon: 'food',
              }}/> 
            <Tab.Screen 
            name="Tutoring" 
            component={TutoringFeed}
            options={{
                tabBarIcon: 'notebook',
              }}/> 
            <Tab.Screen 
            name="GigWork" 
            component={GigWorkFeed}
            options={{
                tabBarIcon: 'briefcase',
              }}/> 
        </Tab.Navigator>
        <Portal>
        <FAB
          icon="plus"
          style={{
            position: 'absolute',
            bottom: 150,
            right: 16,
            borderRadius:50
          }}
        />
      </Portal>
        </React.Fragment>
    );  
}; 