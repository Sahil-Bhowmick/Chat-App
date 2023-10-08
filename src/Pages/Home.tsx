import Sidebar from "../Components/Sidebar";
import ChatSection from "../Components/ChatSection";

const Home = () => {
  return (
    <div className="bg-slate-200 h-screen flex p-8">
      <Sidebar />
      <ChatSection />
    </div>
  );
};

export default Home;
