import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiUpload,
  HiViewGrid,
  HiCollection,
} from "react-icons/hi";

const links = [
  { to: "/", label: "Home", icon: HiHome },
  { to: "/tweets", label: "Tweets", icon: HiCollection },
  { to: "/playlists", label: "Playlists", icon: HiCollection },
  { to: "/dashboard", label: "Dashboard", icon: HiViewGrid },
  { to: "/upload", label: "Upload", icon: HiUpload },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-56 glass-panel">
      <nav className="p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-lg
              text-sm font-medium transition
              ${
                isActive
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
              }
            `
            }
          >
            <Icon className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
