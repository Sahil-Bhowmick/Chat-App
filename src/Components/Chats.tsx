import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "./../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

export interface UserInfo {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface Message {
  text: string;
}

interface Chat {
  userInfo: UserInfo;
  lastMessage?: Message;
  date: number;
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Record<string, Chat>>({});

  const { currentUser } = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid || ""),
        (doc) => {
          if (doc.exists()) {
            setChats(doc.data() as Record<string, Chat>);
          }
        }
      );

      return () => {
        unsub();
      };
    };

    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser?.uid]);

  const handleSelect = (u: UserInfo) => {
    chatContext?.dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map(([chatId, chat]) => {
          const searchUserUid = chat.userInfo.uid;

          if (searchUserUid !== currentUser?.uid) {
            return (
              <div
                className="flex items-center px-2 cursor-pointer h-16 hover:bg-gray-200 rounded-full hover:rounded-md"
                key={chatId}
                onClick={() => handleSelect(chat.userInfo)}
              >
                <img
                  src={chat.userInfo.photoURL}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <span className="block font-bold text-lg">
                    {chat.userInfo.displayName}
                  </span>
                  <p className="text-base text-gray-600">
                    {chat.lastMessage?.text}
                  </p>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
    </div>
  );
};

export default Chats;
