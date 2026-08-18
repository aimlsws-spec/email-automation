import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "app/contexts/auth/context";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const initials = getInitials(user?.name);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-dark-700"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
          {initials}
        </div>
        <div className="hidden text-left md:block">
          <p className="text-sm font-medium leading-tight text-gray-800 dark:text-dark-100">
            {user?.name || "User"}
          </p>
          <p className="text-[11px] leading-tight text-gray-400 dark:text-dark-400">
            {user?.email || ""}
          </p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-dark-600 dark:bg-dark-700">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-dark-600">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-100">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 dark:text-dark-400">
              {user?.email || ""}
            </p>
          </div>

          <div className="border-t border-gray-100 py-1 dark:border-dark-600">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-dark-200 dark:hover:bg-dark-600"
            >
              <ArrowLeftStartOnRectangleIcon className="size-4.5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
