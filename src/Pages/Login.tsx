import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className="bg-blue-300 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 p-4 m-4 md:p-6 lg:p-8 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl text-purple-700 font-bold mb-4">
          Welcome to Chatify
        </h1>
        <h2 className="text-purple-700 text-xl mb-6">Log In</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            className="inputStyle bg-gray-50 rounded-lg pl-2 outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputStyle bg-gray-50 rounded-lg pl-2 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="buttonStyle bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out">
            Sign In
          </button>
          {err && <span>Something Went Wrong.</span>}
        </form>
        <p className="text-purple-700 text-sm mt-4">
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
