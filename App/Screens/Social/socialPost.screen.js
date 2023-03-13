import { Text, Appbar } from 'react-native-paper';
import { View} from 'react-native';

export const SocialPostScreen = ({navigation, route}) => {
  const {event, root} = route.params;
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate(root)} />
        <Appbar.Content title="Back to Feed" />
      </Appbar.Header>
      <View style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, color: 'black', textAlign: 'center', padding: 20}}>
            {event?.eventName ?? ""}
        </Text>
        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center' }}>
            Social event details coming soon!
        </Text>
      </View>
    </View>
  );
}