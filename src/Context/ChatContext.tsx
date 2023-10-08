import { createContext, useContext, useReducer, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface ChatState {
  chatId: string | null;
  user: User;
}

type ActionType = "CHANGE_USER";
interface Action {
  type: ActionType;
  payload: User;
}

export interface ChatContextProps {
  data: ChatState;
  dispatch: React.Dispatch<Action>;
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE: ChatState = {
    chatId: null,
    user: {
      uid: "",
      displayName: "",
      photoURL: "",
    },
  };

  const chatReducer = (state: ChatState, action: Action): ChatState => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser?.uid && action.payload?.uid
              ? currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid
              : null,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
