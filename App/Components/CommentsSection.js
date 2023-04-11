import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { getStandardPlural } from '../utilities';
import { useState, useContext } from 'react';
import { UserContext } from '../Context';
import moment from 'moment';

export const CommentsSection = ({comments}) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [commentButtonsVisible, setCommentButtonsVisible] = useState(false);
  const { uid } = useContext(UserContext);

  const onSubmitComment = () => {
    if (newCommentText === "")
    {
      return;
    }
    setNewCommentText("");
    setCommentButtonsVisible(false)
  };

  const onCancelComment = () => {
    setNewCommentText("");
    setCommentButtonsVisible(false)
  };

  const onCommentBlur = () => {
    if (newCommentText === "")
    {
      setCommentButtonsVisible(false)
    }
  };

  const numComments = comments?.length ?? 0;

  return (
    <View style={{ display: "flex", flexDirection: "column", paddingTop: 40, width: "100%"}}>
        <Text style={{ fontSize: 20, color: "black", borderBottomWidth: 1, borderColor: "#999999", borderStyle: "solid"}}>
            {numComments} Comment{getStandardPlural(numComments)}
        </Text>
        <TextInput
          label="New Comment"
          value={newCommentText}
          multiline={true}
          onChangeText={text => setNewCommentText(text)}
          onFocus={() => setCommentButtonsVisible(true)}
          onBlur={onCommentBlur}
          right={<TextInput.Icon icon="send" onPress={onSubmitComment}/>}
        />
        {commentButtonsVisible && 
            <View style={{display: "flex", flexDirection: "row"}}>
                <Button onPress={onCancelComment}>
                    Cancel
                </Button>
            </View>
            }
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