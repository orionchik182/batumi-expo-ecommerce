import { useUser } from "@clerk/react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  const { user } = useUser();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-full items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
      <div className="p-4 w-full">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <label htmlFor="my-drawer" aria-label="open sidebar">
              <ShoppingBagIcon className="w-6 h-6 text-primary-content cursor-pointer hover:scale-110 transition-all duration-200 " />
            </label>
          </div>
          <span className="text-xl font-bold is-drawer-close:hidden">
            Admin
          </span>
        </div>
      </div>
      <ul className="menu w-full grow flex flex-col gap-2">
        {NAVIGATION.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary text-primary-content" : ""}`}
              >
                {item.icon}
                <span className="is-drawer-close:hidden">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="avatar shrink-0">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || ""}
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0 is-drawer-close:hidden">
            <p className="text-sm font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs opacity-60 truncate">
              {user?.emailAddresses?.[0]?.emailAddress || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
