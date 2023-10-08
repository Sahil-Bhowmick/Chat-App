import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className="bg-slate-100 rounded-lg w-1/4 p-2 mr-1 h-full overflow-hidden">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
