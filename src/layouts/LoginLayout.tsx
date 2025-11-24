import { Outlet } from "react-router-dom";

export const LoginLayout = () => {
  return (
    <div 
      className="min-h-screen w-full m-0 p-0 bg-transparent">
      <Outlet />
    </div>
  );
};


export default LoginLayout;
