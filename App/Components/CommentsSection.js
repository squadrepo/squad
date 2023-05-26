import { View } from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { getStandardPlural } from '../utilities';
import { useState, useContext } from 'react';
import { UserContext } from '../Context';
import moment from 'moment';

export const CommentsSection = ({comments, postFunction}) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [commentButtonsVisible, setCommentButtonsVisible] = useState(false);
  const { uid } = useContext(UserContext);

  const onSubmitComment = async () => {
    if (newCommentText === "") return;
    await postFunction(newCommentText);
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
    <View style={{ display: "flex", flexDirection: "column", paddingTop: 40, paddingBottom: 50, width: "100%"}}>
        <Text style={{ fontSize: 20, color: "black", borderBottomWidth: 1, borderColor: "#999999", borderStyle: "solid"}}>
            {numComments} Comment{getStandardPlural(numComments)}
        </Text>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
          <TextInput
            label="New Comment"
            value={newCommentText}
            multiline={true}
            onChangeText={text => setNewCommentText(text)}
            onFocus={() => setCommentButtonsVisible(true)}
            onBlur={onCommentBlur}
            style={{flexGrow: 1}}
          />
          <IconButton 
            icon="send"
            size={20}
            onPress={onSubmitComment} 
            disabled={newCommentText === ""}
            iconColor={"#6750A4"}
            />
        </View>

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
                      <View style={{paddingTop: 6}}>
                        <Avatar.Image size={36} source={comment?.pfpUrl && {uri: comment?.pfpUrl}}/>
                      </View>

                      <View style={{ display: "flex", flexDirection: "column", paddingLeft: 10}}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, color: "black", fontWeight: "bold"}}>
                                {(comment?.fullName ?? comment.commenterUid.slice(0, 23)) + "  "}
                            </Text>
                            <Text style={{ fontSize: 16, color: "gray", }}>
                                {moment.unix(comment.createTimestamp).fromNow()}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 16, color: "black", paddingBottom: 10}}>
                            {comment.commentText}
                        </Text>
                    </View>
                  </View>
                </View>
            ))}
    </View>
  );
}