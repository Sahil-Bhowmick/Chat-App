import React, { useState, FormEvent } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setErr(true);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        // displayNameLower: displayName.toLowerCase(),
        email,
        photoURL: downloadURL,
      });
      await setDoc(doc(db, "userChats", res.user.uid), {});

      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  return (
    <div className="bg-blue-300 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 p-4 m-4 md:p-6 lg:p-8 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl text-purple-700 font-bold mb-4">
          Welcome to Chatify
        </h1>
        <h2 className="text-purple-700 text-xl mb-6">Register</h2>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            className="inputStyle bg-gray-50 rounded-lg pl-2 outline-none"
            type="text"
            name="displayName"
            placeholder="User Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            className="inputStyle bg-gray-50 rounded-lg pl-2 outline-none"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputStyle bg-gray-50 rounded-lg pl-2 outline-none"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            required
            style={{ display: "none" }}
            type="file"
            id="file"
            name="file"
            onChange={(e) => {
              if (e.target?.files?.length) {
                setFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="file" className="flex items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <RiImageAddLine size={24} />
            </div>
            <span className="ml-2 text-base">Add Profile Picture</span>
          </label>
          <button
            className="buttonStyle bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out"
            type="submit"
          >
            Sign Up
          </button>
          {err && <span>Something Went Wrong.</span>}
        </form>
        <p className="text-purple-700 text-sm mt-4">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
