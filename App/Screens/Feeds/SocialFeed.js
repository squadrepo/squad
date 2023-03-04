import * as React from 'react';
import { TextInput, Button, Text } from 'react-native-paper';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { UserContext } from '../../Context';

export const SocialFeed = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, color: 'black', textAlign: 'center' }}>
        {' '}
        Social Feed
      </Text>
    </View>
  );
};
