import React, { useContext } from "react";
import { FaVideo } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { ChatContext } from "../Context/ChatContext";
import Messages from "./Messages";
import MessageInput from "./MessageInput";

const ChatSection: React.FC = () => {
  const iconStyle: React.CSSProperties = {
    filter: "invert(1)",
    fontSize: "1.3rem",
  };

  const chatContext = useContext(ChatContext)!;
  const { data } = chatContext;
  return (
    <div className="bg-slate-50 rounded-lg w-3/4 h-full p-2 overflow-hidden">
      <div className="h-16 rounded-md bg-slate-300 flex items-center justify-between p-2 text-gray-300">
        <div className="flex items-center px-2 cursor-pointer h-16">
          <img
            src={data.user?.photoURL}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-2">
            <span className="text-xl font-semibold text-black">
              {data.user?.displayName}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-auto p-4">
          <FaVideo
            className="cursor-pointer"
            style={{ ...iconStyle, marginRight: "0.5rem" }}
          />
          <IoCall
            className="cursor-pointer"
            style={{ ...iconStyle, marginRight: "0.5rem" }}
          />
          <FiSearch className="cursor-pointer" style={iconStyle} />
        </div>
      </div>
      <Messages />
      <MessageInput />
    </div>
  );
};

export default ChatSection;
