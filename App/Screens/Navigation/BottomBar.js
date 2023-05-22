import * as React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { HomeFeed } from "../Feeds/HomeFeed";
import { SocialFeed } from "../Feeds/SocialFeed";
import { FoodFeed } from "../Feeds/FoodFeed";
import { TutoringFeed } from "../Feeds/TutoringFeed";
import { GigWorkFeed } from "../Feeds/GigworkFeed";
import { Portal, FAB } from "react-native-paper";
import { UserContext } from "../../Context";
import { Chats } from "../Messaging/chats";

const Tab = createMaterialBottomTabNavigator();

export const Tabs = ({ navigation }) => {
  const { triggerUserFetch } = React.useContext(UserContext);
  return (
    <React.Fragment>
      <Tab.Navigator shifting={true} sceneAnimationEnabled={true}>
        <Tab.Screen
          name="Home"
          component={HomeFeed}
          options={{
            tabBarIcon: "home"
          }}
        />
        <Tab.Screen
          name="Social"
          component={SocialFeed}
          options={{
            tabBarIcon: "account-group"
          }}
        />
        <Tab.Screen
          name="Food"
          component={FoodFeed}
          options={{
            tabBarIcon: "food"
          }}
        />
        <Tab.Screen
          name="Tutoring"
          component={TutoringFeed}
          options={{
            tabBarIcon: "notebook"
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Chats}
          options={{
            tabBarIcon: "message"
          }}
        />
      </Tab.Navigator>
    </React.Fragment>
  );
};
