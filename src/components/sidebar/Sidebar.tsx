import { ToggleTheme } from "../ToggleTheme";

import SidebarItem, { SidebarItemType } from "./SidebarItem";
import { cn } from "@/lib/utils";
import useThemeStore from "@/store/themeStore";
import { HomeIcon, PlusIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const sidebarItems: SidebarItemType[] = [
  {
    name: "Explorer",
    link: "/",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    name: "My Vote Polls",
    link: "/my-polls",
    icon: <UserIcon className="w-5 h-5" />,
  },
  {
    name: "Create Vote Poll",
    link: "/create-poll",
    icon: <PlusIcon className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen } = useThemeStore();

  const closeSidebar = () => useThemeStore.setState({ isSidebarOpen: false });

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 w-full h-full bg-black/50"
          onClick={() => closeSidebar()}
        ></div>
      )}
      <aside
        className={cn(
          "fixed z-20 bg-background border-r h-full inset-0 lg:translate-x-0 transition-transform duration-300 pt-20 max-w-full w-[250px]",
          isSidebarOpen ? "translate-x-0" : "translate-x-[-250px]"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item, key) => (
              <SidebarItem key={key} item={item} />
            ))}
          </div>
          <div className="flex justify-center px-3 py-4 border-t">
            <ToggleTheme />
          </div>
        </div>
      </aside>
    </>
  );
}
