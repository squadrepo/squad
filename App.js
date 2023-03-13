import "react-native-gesture-handler";
import {
  Provider as PaperProvider,
  View,
  Text,
  TouchableOpacity
} from "react-native-paper";
import { LoginScreen } from './App/Screens/Login/login.screen';
import { SignUpScreen } from './App/Screens/SignUp/signup.screen';
import { Settings } from './App/Screens/Settings/settings.screen';
import { Password } from './App/Screens/Settings/password.screen';
import { EmailChange } from './App/Screens/Settings/email.screens';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react-native';
import { Amplify } from '@aws-amplify/core';
import awsConfig from './aws-exports';
import awsmobile from './aws-exports';
import { MainDrawer } from './App/Screens/Navigation/Drawer';
import { Platform, StyleSheet } from 'react-native';
import { UserContext, UserProvider } from "./App/Context";
import { PURPLE_COLOR } from './App/constants';
import { MessageOverview } from "./App/Screens/Messaging/MessageOverview";
import { Chats } from "./App/Screens/Messaging/chats";
import { ChatRoom } from "./App/Screens/Messaging/ChatRoom";

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

// Properties available to override: https://github.com/aws-amplify/amplify-js/blob/main/packages/aws-amplify-react-native/src/AmplifyTheme.ts
const buttonColor = PURPLE_COLOR;
const disabledButtonColor = buttonColor + '80';
const theme = StyleSheet.create({
  ...AmplifyTheme,
	sectionFooterLink: {
		...AmplifyTheme.sectionFooterLink,
		color: buttonColor,
	},
	sectionFooterLinkDisabled: {
		...AmplifyTheme.sectionFooterLinkDisabled,
		color: disabledButtonColor,
	},
	button: {
    ...AmplifyTheme.button,
		backgroundColor: buttonColor,
	},
	buttonDisabled: {
    ...AmplifyTheme.buttonDisabled,
		backgroundColor: disabledButtonColor,
	},
});

function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawers" component={MainDrawer} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Password" component={Password} />
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

export default withAuthenticator(App, { signUpConfig }, undefined, undefined, theme);
