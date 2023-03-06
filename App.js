import "react-native-gesture-handler";
import {
  Provider as PaperProvider,
  View,
  Text,
  TouchableOpacity
} from "react-native-paper";
import { LoginScreen } from "./App/Screens/Login/login.screen";
import { SignUpScreen } from "./App/Screens/SignUp/signup.screen";
import { Settings } from "./App/Screens/Settings/settings.screen";
import { Password } from "./App/Screens/Settings/password.screen";
import { Dob } from "./App/Screens/Settings/dob.screen";
import { EmailChange } from "./App/Screens/Settings/email.screens";
import { MessageOverview } from "./App/Screens/Messaging/MessageOverview";

import { MainDrawer } from "./App/Screens/Navigation/Drawer";
import { Chats } from "./App/Screens/Messaging/chats";
import { ChatRoom } from "./App/Screens/Messaging/ChatRoom";
} from 'react-native-paper';


import { ProfileScreen } from "./App/Screens/Profile/profile.screen";
import { ProfileViewScreen } from "./App/Screens/Profile/profileView.screen";
import { ProfileEditScreen } from "./App/Screens/Profile/profileEdit.screen";
import { ProfileEditUsernameScreen } from "./App/Screens/Profile/profileEditUsername.screen";
import { ProfileEditBioScreen } from "./App/Screens/Profile/profileEditBio.screen";

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { withAuthenticator } from 'aws-amplify-react-native';
import { Amplify } from '@aws-amplify/core';
import awsConfig from './aws-exports';
import awsmobile from './aws-exports';
import { MainDrawer } from './App/Screens/Navigation/Drawer';

import { Auth } from "aws-amplify";
import { UserContext, UserProvider } from "./App/Context";

Amplify.configure({ awsConfig, ...awsmobile, Analytics: { disabled: true } });

const Stack = createNativeStackNavigator();

const signUpConfig = {
  hiddenDefaults: ["phone_number"],
  signUpFields: [
    {
      label: "Name",
      key: "name",
      required: true,
      displayOrder: 1,
      type: "name",
      custom: false
    }
  ]
};

function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
              //initialRouteName="Settings" 
              initialRouteName="Profile" 
              screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawers" component={MainDrawer} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ViewProfile" component={ProfileViewScreen} />
            <Stack.Screen name="EditProfile" component={ProfileEditScreen} />
            <Stack.Screen name="Username" component={ProfileEditUsernameScreen}/>
            <Stack.Screen name="Bio" component={ProfileEditBioScreen}/>
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Password" component={Password} />
            <Stack.Screen name="Dob" component={Dob} />
            <Stack.Screen name="EmailChange" component={EmailChange} />
            <Stack.Screen name="MessageOverview" component={MessageOverview} />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}

export default withAuthenticator(App, { signUpConfig });
