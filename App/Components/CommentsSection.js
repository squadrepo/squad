import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getStandardPlural } from '../utilities';
import moment from 'moment';

export const CommentsSection = ({comments}) => {
  const numComments = comments?.length ?? 0;

  return (
    <View style={{ display: "flex", flexDirection: "column", paddingTop: 20, width: "100%"}}>
        <Text style={{ fontSize: 20, color: "black", borderBottomWidth: 1, borderColor: "#999999", borderStyle: "solid"}}>
            {numComments} Comment{getStandardPlural(numComments)}
        </Text>
        {comments && 
            comments.map((comment, index) => (
                <View key={index}>
                    <View style={{ display: "flex", flexDirection: "row", paddingTop: 10 }}>
                        <Text style={{ fontSize: 16, color: "black", fontWeight: "bold"}}>
                            {comment.commenterUid.slice(0, 23) + "  "}
                        </Text>
                        <Text style={{ fontSize: 16, color: "gray", }}>
                            {moment.unix(comment.createTimestamp).fromNow()}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: "black", paddingLeft: 5, paddingBottom: 10}}>
                        {comment.commentText}
                    </Text>
                </View>
            ))}
    </View>
  );
}

const styles = StyleSheet.create({
  commentBox: {
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "#999999",
    borderStyle: "solid",
    backgroundColor: "white"
  },
});