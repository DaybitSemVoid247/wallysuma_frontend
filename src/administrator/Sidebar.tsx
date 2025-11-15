import { NavLink } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineChartBar,
  HiOutlineShoppingBag,
  HiUserCircle,
} from "react-icons/hi";

const sidebarLinks = [
  {
    id: 1,
    title: "Productos",
    href: "/administrator/productos",
    icon: HiOutlineViewGrid,
  },
  {
    id: 2,
    title: "Usuarios",
    href: "/administrator/usuarios",
    icon: HiOutlineUsers,
  },
  {
    id: 3,
    title: "Estadísticas",
    href: "/administrator/estadisticas",
    icon: HiOutlineChartBar,
  },
  {
    id: 4,
    title: "Pedidos",
    href: "/administrator/pedidos",
    icon: HiOutlineShoppingBag,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#f6f1eb]  border-r border-slate-200 min-h-screen p-5">
      <div className="space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#d88c6f] text-white"
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              <Icon size={22} />
              <span className="font-medium">{link.title}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
