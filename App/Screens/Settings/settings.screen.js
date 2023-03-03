// TODO:
// UnivExcl does not save upon post request

import React, { useState, useEffect, useContext } from 'react';
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
import { UserContext } from '../../Context';

export const Settings = ({ navigation }) => {
  const {
    uid,
    password,
    setPassword,
    dob,
    setDOB,
    email,
    setEmail,
    univExclExp,
    setUnivExclExp
  } = useContext(UserContext);

  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(univExclExp);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const baseUrl =
    'https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/account/editSettings';

  useEffect(() => {
    console.log(password);
    console.log(isSwitchOn);
    console.log(dob);
    console.log(email);
    console.log(uid);
    console.log(' ');
  }, [password, isSwitchOn, dob, email, uid]);

  //API post
  //TODO: univExclExp is not saving
  const saveSettings = async (event) => {
    try {
      if (passwordChanged) {
        const response = await axios.post(baseUrl, {
          uid: uid,
          dob: dob,
          email: email,
          univExclExp: isSwitchOn,
          password: password
        });
        console.log(response.status);
        alert('Settings saved successfuly.');
      } else {
        const response = await axios.post(baseUrl, {
          uid: uid,
          dob: dob,
          email: email,
          univExcExp: isSwitchOn
        });
        console.log(response.status);
        alert('Settings saved successfuly.');
      }
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
        <Appbar.BackAction onPress={() => navigation.navigate('Main')} />
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
              passwordChanged,
              setPasswordChanged
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
          onPress={() => navigation.navigate('Dob')}
        />
      </View>
      <View style={styles.options}>
        <Menu.Item title="Change University Email" />
        <IconButton
          icon="dots-horizontal"
          onPress={() => navigation.navigate('EmailChange')}
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
