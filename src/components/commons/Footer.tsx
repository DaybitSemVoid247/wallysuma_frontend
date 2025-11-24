import { useNavigate, NavLink } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-16 bg-gray-950 px-flex justify-between gap-10 text-slate-200 text-sm felx-wrap mt-10 md:flex-noweap">
      <div
        className={
          "text-2xl font-bold trackinf-tighter transition-all text-white flex-1 cursor-pointer"
        }
        onClick={() => navigate("/")}
      >
        Boutique 
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
          no se que poner aquiii
        </p>
        <NavLink to="/administrator">Ir a Administración</NavLink>
      </div>
    </footer>
  );
};
