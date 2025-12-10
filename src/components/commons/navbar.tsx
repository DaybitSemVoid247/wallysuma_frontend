import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlineUser } from "react-icons/hi";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { navbarLinks } from "../../constants/links";
import { Logo } from "./Logo";
import { LanguageSelector } from "../LanguageSelector";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  if (location.pathname.startsWith("/administrator")) {
    return null;
  }

  const [usuario, setUsuario] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen(false); // Cerrar menú al hacer scroll
      } else if (currentScrollY < lastScrollY - 2) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    setUsuario(null);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[#e8dfd5] text-black py-3 sm:py-4 flex items-center justify-between px-4 sm:px-5 border-b border-slate-200 lg:px-12 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Logo />

        {/* Navigation Desktop */}
        <nav className="space-x-5 hidden md:flex">
          {navbarLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `${
                  isActive ? "text-[#9e4e2f] underline" : ""
                } transition-all duration-300 font-medium hover:text-[#9e4e2f] hover:underline`
              }
            >
              {t(link.title)}
            </NavLink>
          ))}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex gap-3 lg:gap-5 items-center">
          <LanguageSelector />

          {usuario ? (
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="border-2 border-slate-700 w-8 h-8 lg:w-9 lg:h-9 rounded-full grid place-items-center text-base lg:text-lg font-bold bg-cyan-600 text-white">
                {usuario.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col text-sm">
                <span className="font-semibold">{usuario.nombre}</span>
                <span className="text-xs text-gray-600">{usuario.rol}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold"
            >
              <HiOutlineUser size={20} />
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <IoClose size={28} />
          ) : (
            <FaBarsStaggered size={24} />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#e8dfd5] z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* User Info Mobile */}
          {usuario ? (
            <div className="mb-6 pb-6 border-b border-slate-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="border-2 border-slate-700 w-12 h-12 rounded-full grid place-items-center text-xl font-bold bg-cyan-600 text-white">
                  {usuario.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">
                    {usuario.nombre}
                  </span>
                  <span className="text-sm text-gray-600">{usuario.rol}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-300 text-lg font-medium"
            >
              <div className="border-2 border-slate-700 w-10 h-10 rounded-full grid place-items-center">
                <HiOutlineUser size={22} />
              </div>
              <span>{t("login")}</span>
            </NavLink>
          )}

          {/* Navigation Links Mobile */}
          <nav className="flex flex-col space-y-4 mb-6">
            {navbarLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `${
                    isActive ? "text-[#9e4e2f] font-semibold" : ""
                  } text-lg transition-all duration-300 font-medium hover:text-[#9e4e2f] py-2`
                }
              >
                {t(link.title)}
              </NavLink>
            ))}
          </nav>

          {/* Language Selector Mobile */}
          <div className="mt-auto mb-6">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
};
