import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, TextInput } from "react-native-paper";
import { LoginScreen } from "./App/Screens/Login/login.screen";
import { SignUpScreen } from "./App/Screens/SignUp/signup.screen";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { withAuthenticator } from "aws-amplify-react-native";
import Amplify from "@aws-amplify/core";
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

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
      custom: false,
    },
  ],
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default withAuthenticator(App, { signUpConfig });
