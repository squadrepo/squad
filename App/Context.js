import { createContext, React, useState } from "react";

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
  const [fetchUserTrigger, setFetchuserTrigger] = useState(false);
  const triggerUserFetch = () => setFetchuserTrigger(!fetchUserTrigger);

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
        setPassword,
        fetchUserTrigger,
        triggerUserFetch
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
