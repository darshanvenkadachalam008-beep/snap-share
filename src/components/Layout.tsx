import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pb-16 md:pb-0 md:pl-[72px] lg:pl-[245px]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
