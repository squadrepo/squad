import React, { useState, useContext } from 'react';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/core';
import { UserContext } from '../../Context';

export const Password = ({ navigation, route }) => {
  const [newPwrd, setNewPwrd] = useState('');
  const [newPwrdAgain, setNewPwrdAgain] = useState('');
  const { setPassword } = useContext(UserContext);

  const done = () => {
    if (newPwrd === newPwrdAgain) {
      setPassword(newPwrd);
      route.params.setPasswordChanged(true);
      navigation.navigate('Settings');
    } else {
      alert('Please make sure both passwords are equal');
    }
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Password" />
        <Button textDecoration="underline" onPress={done}>
          Done
        </Button>
      </Appbar.Header>
      <View>
        <TextInput
          label="New password"
          secureTextEntry={true}
          onChangeText={(text) => setNewPwrd(text)}
        ></TextInput>
        <TextInput
          label="New password again"
          secureTextEntry={true}
          onChangeText={(text) => setNewPwrdAgain(text)}
        ></TextInput>
      </View>
    </View>
  );
};
