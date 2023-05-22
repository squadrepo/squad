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
    borderBottomWidth: 0.1,
    borderTopWidth: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56, 
    elevation: 4, 
  },
  topBarText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    // textShadowColor: "#00000075",
    // textShadowOffset: {width: -1, height: 1},
    // textShadowRadius: 10
  },
  topBarButton:{
    marginLeft: "auto",
  }, 
  rsvpButton: {
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  plusButton: {
    marginRight:-15, 
    marginLeft:'auto'
  },
})