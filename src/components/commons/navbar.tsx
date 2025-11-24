import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi";
import { FaBarsStaggered } from "react-icons/fa6";
import { navbarLinks } from "../../constants/links";
import { Logo } from "./Logo";

export const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (usuarioActual) {
      setUsuario(JSON.parse(usuarioActual));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 2 && currentScrollY > 2) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 2) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    setUsuario(null);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#e8dfd5] text-black py-4 flex items-center justify-between px-5 border-b border-slate-200 lg:px-12 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Logo />
      <nav className="space-x-5 hidden md:flex">
        {navbarLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            className={({ isActive }) =>
              `${
                isActive ? "text-[#9e4e2f] underline" : ""
              } transition-all duration-300 font-medium hover:text-[#9e4e2f] hover:underline `
            }
          >
            {link.title}
          </NavLink>
        ))}
      </nav>

      <div className="flex gap-5 items-center">
        {usuario ? (
          <div className="flex items-center gap-3">
            <div className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold bg-cyan-600 text-white">
              {usuario.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">{usuario.nombre}</span>
              <span className="text-xs text-gray-600">{usuario.rol}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ml-2"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <NavLink
              to="/login"
              className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold"
            >
              <HiOutlineUser size={20} />
            </NavLink>
          </div>
        )}
      </div>
      <button className="md:hidden">
        <FaBarsStaggered size={25} />
      </button>
    </header>
  );
};
