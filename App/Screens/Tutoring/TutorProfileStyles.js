import { StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    title:{ 
        fontSize: 30, 
        fontWeight: "bold",
        marginTop: 55,
        marginLeft: 20
    }, 
    caption: {   
        marginLeft: 20,
        marginTop:5
    },
    picture:{
        marginLeft: 10,
        marginTop:40
    }, 
    stars:{
        marginTop:10,
        marginLeft: 15
    }, 
    topButtons: {
        flexDirection: "row",
        marginTop:20
    }, 
    headline:{ 
        fontSize: 25, 
        marginTop: 30,
        marginLeft: 20
    }, 
    text:{
        marginLeft: 20, 
        marginTop: 10
    }, 
    allTags:{
        marginLeft: 20, 
        marginTop: 10,
        flexDirection: "row"
    }, 
    tag:{
        marginRight: 10,
        borderWidth: 4,
        borderColor: "#bfbdb5",
        borderRadius: 10,
        backgroundColor: "#bfbdb5",
        overflow: "hidden", 
        fontSize: 17
     },
     modalContainer: {
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
         backgroundColor: "rgba(0, 0, 0, 0.5)"
     },
     modalContent: {
         backgroundColor: "white",
         padding: 20,
         marginLeft: 40,
         marginRight: 40,
         borderRadius: 10,
         alignItems: "center",
         justifyContent: "center"
     }, 
     modalTitle: {
        marginTop: 10, 
        marginBottom: 10
     }, 
     activityIndicator: {
        position: "absolute",
        alignSelf: "center",
        top: "50%",
      }
})