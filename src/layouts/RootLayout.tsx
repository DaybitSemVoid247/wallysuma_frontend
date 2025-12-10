import { Outlet } from "react-router-dom";
import { Navbar } from "../components/commons/navbar";

export const RootLayout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-5 bg-[#f6f1eb] pt-24">
          <Outlet />
        </main>
      </div>
    </>
  );
};
