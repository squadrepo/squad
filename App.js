import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, TextInput } from "react-native-paper";
import { LoginScreen } from "./App/Screens/Login/login.screen";
import { SignUpScreen } from "./App/Screens/SignUp/signup.screen";
import { Settings } from "./App/Screens/Settings/settings.screen";
import { Password } from "./App/Screens/Settings/password.screen";
import { Dob } from "./App/Screens/Settings/dob.screen";
import { EmailChange } from "./App/Screens/Settings/email.screens";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { withAuthenticator } from "aws-amplify-react-native";
import Amplify from "@aws-amplify/core";
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      {/*<Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >*/}
      <Stack.Navigator
        initialRouteName="Settings"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="Dob" component={Dob} />
        <Stack.Screen name="EmailChange" component={EmailChange} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//export default withAuthenticator(App);
export default App;
