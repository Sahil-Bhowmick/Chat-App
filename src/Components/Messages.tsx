import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Message {
  message: {
    id: string;
    [key: string]: any;
  };
}

interface ChatContextProps {
  data:
    | {
        chatId: string;
      }
    | undefined;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContext = useContext<ChatContextProps>(ChatContext);

  useEffect(() => {
    if (!chatContext || !chatContext.data || !chatContext.data.chatId) {
      return;
    }

    const unSub = onSnapshot(
      doc(db, "chats", chatContext.data.chatId),
      (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages as Message[]);
        }
      }
    );

    return () => {
      unSub();
    };
  }, [chatContext]);

  console.log(messages);

  return (
    <div className="p-4 h-[calc(100%-160px)] overflow-y-scroll no-scrollbar">
      {messages.map((message) => (
        <Message key={message.message.id} message={message.message} />
      ))}
    </div>
  );
};

export default Messages;
