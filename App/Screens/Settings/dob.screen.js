import * as React from 'react';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import DatePicker from '@dietime/react-native-date-picker';

export const Dob = ({ navigation, route }) => {
  const done = () => {
    route.params.setDOB(date);
    navigation.navigate('Settings');
  };

  const [date, setDate] = React.useState(new Date());

  const convertDate = (dateObject) => {
    const newDate = Math.round(dateObject.getTime() / 1000);
    setDate(newDate);
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Date Of Birth" />
        <Button textDecoration="underline" onPress={done}>
          Done
        </Button>
      </Appbar.Header>
      <Text>{'Select date... dd/mm/yyyy'}</Text>
      <SafeAreaView>
        <DatePicker
          startYear={1990}
          value={date}
          onChange={(value) => convertDate(value)}
          //format="yyyy-mm-dd"
        />
      </SafeAreaView>
    </View>
  );
};
