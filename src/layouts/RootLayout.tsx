import { Outlet } from "react-router-dom";
import { Navbar } from "../components/commons/navbar";
import { Footer } from "../components/commons/Footer";

export const RootLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-5 bg-[#f6f1eb]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};
