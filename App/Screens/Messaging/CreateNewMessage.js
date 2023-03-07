import * as React from 'react';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { SafeAreaView, View, StyleSheet } from 'react-native';

export const CreateNewMessage = ({ navigation }) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Messages" />
        <Button icon="plus-box" />
      </Appbar.Header>
    </View>
  );
};
