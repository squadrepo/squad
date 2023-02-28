import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  Text,
  Appbar,
  Menu,
  IconButton,
  Switch
} from 'react-native-paper';
import { SafeAreaView, View, StyleSheet, useRoute } from 'react-native';
import { Auth } from '@aws-amplify/auth';
import axios from 'axios';

export const Settings = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  {
    /*Relevant settings states that may change based on users input */
  }
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [dob, setDOB] = useState('');
  const [uniEmail, setUniEmail] = useState('');
  const [UUID, setUUID] = useState('');
  const [userObject, setUserObject] = useState('');

  const baseUrl =
    'https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/editSettings';
  const getUrl =
    'https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/user?uid=';
  async function getUserUUID() {
    try {
      // Get the current authenticated user
      const currentUser = await Auth.currentAuthenticatedUser();

      // Get the user's UUID
      const userUUID = currentUser.attributes.sub;

      console.log('User UUID:', userUUID);

      return userUUID;
    } catch (error) {
      console.log('Error getting user UUID:', error);
      throw error;
    }
  }

  useEffect(() => {
    console.log(oldPassword);
    console.log(newPassword);
    console.log(newPasswordAgain);
    console.log(isSwitchOn);
    console.log(dob);
    console.log(uniEmail);
    console.log(UUID);
    console.log(' ');
  }, [
    oldPassword,
    newPassword,
    newPasswordAgain,
    isSwitchOn,
    dob,
    uniEmail,
    UUID
  ]);

  useEffect(() => {
    const getUid = async () => {
      try {
        const UUID = await getUserUUID();
        setUUID(UUID);

        // Invoking get method to perform a GET request
        axios.get(`${getUrl}${UUID}`).then((response) => {
          setUserObject(response.data);
          console.log(response.data);
        });
      } catch (error) {
        if (error.response == undefined) throw error;
        const { response } = errorObj;
        return console.log(`${response.status}: ${response.data}`);
      }
    };
    getUid();
  }, []);

  //API post
  const saveSettings = async (event) => {
    try {
      const response = await axios.post(baseUrl, {
        uid: UUID,
        email: uniEmail,
        password: newPassword
      });
      console.log(response.status);
    } catch (error) {
      alert('An error has occurred');

      if (error.response === undefined) {
        throw error;
      }
      const { response } = error;
      console.log(response.status);
      console.log(response.data);
    }
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction />
        <Appbar.Content title="Settings" />
        <Button textDecoration="underline" onPress={saveSettings}>
          Save
        </Button>
      </Appbar.Header>
      <View style={styles.options}>
        <Menu.Item title="Password" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate('Password', {
              oldPassword: oldPassword,
              newPassword: newPassword,
              newPasswordAgain: newPasswordAgain,
              setOldPassword: setOldPassword,
              setNewPassword: setNewPassword,
              setNewPasswordAgain: setNewPasswordAgain
            })
          }
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="University Exclusive" />
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Date Of Birth" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate('Dob', {
              dob: dob,
              setDOB: setDOB
            })
          }
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Change University Email" />
        <IconButton
          icon="dots-horizontal"
          onPress={() =>
            navigation.navigate('EmailChange', {
              uniEmail: uniEmail,
              setUniEmail: setUniEmail
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  toggle: {
    paddingRight: 10
  }
});
