import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex items-center bg-slate-300 h-16 p-2 rounded-md justify-between shadow-lg w-full">
      <span className="text-2xl font-bold text-black">Chatify</span>
      <div className="flex items-center space-x-4 ml-auto">
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile Picture"
            className="bg-slate-200 h-12 w-12 rounded-full object-cover overflow-hidden"
          />
        ) : null}
        <span className="text-black font-medium text-lg">
          {currentUser?.displayName}
        </span>
        <button
          className="bg-slate-300 text-black text-sm p-1 rounded-full border-none cursor-pointer"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
