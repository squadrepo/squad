import * as React from 'react';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import DatePicker from '@dietime/react-native-date-picker';

export const Dob = ({ navigation, route }) => {
  const done = () => {
    route.params.setDOB(date);
    navigation.navigate('Settings');
  };

  const [date, setDate] = React.useState();

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Date Of Birth" />
        <Button textDecoration="underline" onPress={done}>
          Done
        </Button>
      </Appbar.Header>
      <Text>{date ? date.toDateString() : 'Select date...'}</Text>
      <SafeAreaView>
        <DatePicker
          startYear={1990}
          value={Math.floor(Date.parse(date) / 1000)}
          onChange={(value) => setDate(value)}
          //format="yyyy-mm-dd"
        />
      </SafeAreaView>
    </View>
  );
};
