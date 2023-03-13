import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Context";

//ToDo
//Room Name - data comes from Dom's screen, needs to imported here and used, current use dummy data, pass it via route params in stack navigator
//all memberUids - data comes from Dom's screen, needs to imported here and used, current use dummy data
//

export function FirstMessage(currentuser_uid, users) {
  //console.log("Line 12(users): ", users);

  const sendFirstMessage = async (users) => {
    const [chatroomCID, setChatroomCID] = useState("");
    const [roomName, setRoomName] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const allMemberUids = users.map((user) => user.uid);
    console.log("ALL USERS UID: ", allMemberUids);

    const allMemberNamesString = users.map((user) => user.username).join(", ");
    console.log(allMemberNamesString);

    try {
      const baseUrl =
        "https://ca8vo445sl.execute-api.us-east-1.amazonaws.com/test/messages/createChatroom";
      const body = {
        roomName: allMemberNamesString, //update based on thr roomname created
        memberUids: allMemberUids,
        requesterUid: currentuser_uid
      };

      const config = { "content-type": "application/json" };
      const response = await axios.post(baseUrl, body, config);
      setChatroomCID(response.data.chatroomCID);
      setTimestamp(response.data.timestamp);
      console.log(chatroomCID);
      console.log(timestamp);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return sendFirstMessage(users);
}
