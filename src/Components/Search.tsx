import React, { useContext, useState, KeyboardEvent } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
import { RiSearchLine } from "react-icons/ri";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Search: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [err, setErr] = useState<boolean>(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        setUser(null);
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data() as User);
          setErr(false);
        });
      }
    } catch (err) {
      setErr(true);
    }
    setUsername("");

    setTimeout(() => {
      setErr(false);
    }, 3000);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!currentUser) {
      return;
    }
    const combinedId =
      currentUser.uid > user!.uid
        ? currentUser.uid + user!.uid
        : user!.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user!.uid,
            displayName: user!.displayName,
            photoURL: user!.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user!.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  return (
    <div className="border-b pb-1.5 border-gray-300 py-3">
      <div className="px-2 mb-2 flex items-center">
        <input
          type="text"
          placeholder="Search a User"
          className="w-full py-1.5 px-4 border border-gray-400 rounded-full focus:outline-none"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-gray-200 p-2 rounded-full"
        >
          <RiSearchLine size={24} />
        </button>
      </div>
      {err && (
        <span className="text-red-500 flex justify-center">
          Sorry, User not found!
        </span>
      )}
      {user && (
        <div
          className="flex items-center px-2 cursor-pointer h-16 hover:bg-gray-200 rounded-full hover:rounded-md"
          onClick={handleSelect}
        >
          <img
            src={user!.photoURL}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <span className="block font-bold text-lg">{user!.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
