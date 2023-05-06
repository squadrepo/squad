import { createContext, React, useContext, useState } from "react";
import { Auth } from "@aws-amplify/auth";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [aboutMe, setAboutMe] = useState("");
  const [classHist, setClassHist] = useState("");
  const [dispTags, setDispTags] = useState("");
  const [dobNum, setDobNum] = useState(0);
  const [email, setEmail] = useState("");
  const [emailLastVerifiedDateNum, setEmailLastVerifiedDateNum] = useState(0);
  const [fullName, setFullName] = useState("");
  const [pfpUrl, setPfpUrl] = useState("");
  const [tags, setTags] = useState("");
  const [tutorRating, setTutorRating] = useState("");
  const [uid, setUid] = useState("");
  const [univ, setUniv] = useState("");
  const [univExclExp, setUnivExclExp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [chatroomCids, setChatroomCids] = useState([]);

  return (
    <UserContext.Provider
      value={{
        aboutMe,
        setAboutMe,
        chatroomCids,
        setChatroomCids,
        classHist,
        setClassHist,
        dispTags,
        setDispTags,
        dobNum,
        setDobNum,
        email,
        setEmail,
        emailLastVerifiedDateNum,
        setEmailLastVerifiedDateNum,
        fullName,
        setFullName,
        pfpUrl,
        setPfpUrl,
        tags,
        setTags,
        tutorRating,
        setTutorRating,
        uid,
        setUid,
        univ,
        setUniv,
        univExclExp,
        setUnivExclExp,
        username,
        setUsername,
        password,
        setPassword
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
