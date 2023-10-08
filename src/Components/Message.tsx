import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="flex justify-start mb-4">
      <div className="flex flex-col items-center mr-2">
        <img src="" alt="" className="rounded-full w-8 h-8" />
        <span className="text-xs text-gray-500 whitespace-nowrap">
          Just now
        </span>
      </div>
      <div className="bg-green-100 p-3 rounded-lg">
        <p className="text-black break-words">
          Hello, What's up? This is a multiline message to demonstrate how the
          message container adjusts its height based on the content. This is
          similar to how WhatsApp displays multiline messages.
        </p>
      </div>
    </div>
  );
};

export default Message;
