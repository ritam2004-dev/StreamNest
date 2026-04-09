import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiUpload,
  HiViewGrid,
  HiCollection,
  HiX,
} from "react-icons/hi";

const links = [
  { to: "/", label: "Home", icon: HiHome },
  { to: "/tweets", label: "Tweets", icon: HiCollection },
  { to: "/playlists", label: "Playlists", icon: HiCollection },
  { to: "/dashboard", label: "Dashboard", icon: HiViewGrid },
  { to: "/upload", label: "Upload", icon: HiUpload },
];

export default function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Drawer */}
      <aside className="
        relative h-full w-64
        bg-neutral-950 border-r border-neutral-800
        p-4
        animate-slideIn
      ">
        <button
          onClick={onClose}
          className="mb-4 p-2 rounded-lg hover:bg-neutral-800"
        >
          <HiX className="text-xl" />
        </button>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
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
    </div>
  );
}
