import { StyleSheet } from 'react-native';

export const feedStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#DDDDDD",
  },
  topBar: {
    backgroundColor:'#EADDFF',
    padding: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBarText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20
    // textShadowColor: "#00000075",
    // textShadowOffset: {width: -1, height: 1},
    // textShadowRadius: 10
  },
  topBarButton:{
    marginLeft: "auto",
  }
})