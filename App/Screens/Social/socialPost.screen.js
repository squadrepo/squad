import { Button, Text, Appbar } from 'react-native-paper';
import { View } from 'react-native';
import { useEffect } from 'react';

export const SocialPostScreen = ({navigation, route}) => {
  const {event, root} = route.params;

  useEffect(() => {
    console.log(event);
  });

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Back to Feed" />
      </Appbar.Header>
      <View style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, color: 'black', textAlign: 'center', padding: 20}}>
            {event?.eventName ?? ""}
        </Text>
        <Button mode="outlined" style={{ fontSize: 20, color: 'black', textAlign: 'center' }} onPress={() => navigation.navigate("Chats", {eventData : event})}>
            Share event
        </Button>
      </View>
    </View>
  );
}