import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem  } from '@react-navigation/drawer';
import { FoodFeed } from '../Feeds/FoodFeed';
import { SocialFeed } from '../Feeds/SocialFeed';
import { Settings } from '../Settings/settings.screen';
import { Tabs } from './BottomBar';
import { Auth, Hub } from 'aws-amplify'
import { ProfileScreen } from '../Profile/profile.screen';

const Drawer = createDrawerNavigator(); 

export const SignOutButton = (props) => {

    const signOut = async () => {
      try {
        await Auth.signOut();
        Hub.dispatch('UI Auth', {   // channel must be 'UI Auth'
            event: 'AuthStateChange',    // event must be 'AuthStateChange'
            message: 'signedout'    // message must be 'signedout'
        });
    } catch (error) {
        console.log('error signing out: ', error);
    }
  
    }
  
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Sign Out" onPress={signOut} />
      </DrawerContentScrollView>
    );
  };
  
  

export const MainDrawer = () => {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <SignOutButton{...props}/>}
    screenOptions={{ headerShown: false, 
    drawerPosition:"right"}}>
      <Drawer.Screen name="Main" component={Tabs}/>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};