import { Outlet } from "react-router-dom";
import { Navbar } from "../components/commons/navbar";
import { Sidebar } from "./Sidebar";

export const RootAdmin = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex pt-16 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5 bg-[#f0ede9]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
