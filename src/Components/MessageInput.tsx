import React, { useContext, useState, ChangeEvent } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { BiImageAdd } from "react-icons/bi";
import { FaRegSmile } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext, ChatContextProps } from "../Context/ChatContext";
import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const MessageInput: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);

  const { currentUser } = useContext(AuthContext);
  const chatContext = useContext<ChatContextProps | undefined>(ChatContext);
  const { data } = chatContext || {};

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImg(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!currentUser || !data?.chatId) {
      console.error("No currentUser or chatId found.");
      return;
    }

    const chatCollection = collection(db, "chats");
    const chatDocumentRef = doc(chatCollection, data.chatId);

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await updateDoc(chatDocumentRef, {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        }
      );
    } else {
      await updateDoc(chatDocumentRef, {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data?.user.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="bg-slate-300 p-2 mt-8 flex flex-col md:flex-row items-center rounded-md border-t border-gray-200">
      <div className="flex items-center space-x-2 p-1 mb-2 md:mb-0">
        <button>
          <FaRegSmile className="text-gray-600 cursor-pointer text-2xl" />{" "}
        </button>
        <GrAttachment className="text-gray-600 cursor-pointer text-2xl" />
        <label htmlFor="file">
          <BiImageAdd className="text-gray-600 cursor-pointer text-2xl" />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleImgChange}
        />
      </div>
      <input
        type="text"
        placeholder="Type a message"
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="flex-grow px-3 py-2.5 border border-gray-300 rounded-full ml-1 md:ml-2 md:mr-2 focus:outline-none"
      />
      <div className="flex items-center">
        <button onClick={handleSend}>
          <BsFillSendFill className="text-blue-600 text-3xl mr-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
