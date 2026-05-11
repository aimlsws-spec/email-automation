// Import Dependencies
import clsx from "clsx";
import { ViewColumnsIcon } from "@heroicons/react/24/outline";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button, ScrollShadow } from "components/ui";
import { Boards } from "./Boards";
import { Workspaces } from "./Workspaces";

// ----------------------------------------------------------------------

export function SidebarPanel() {
  const { cardSkin } = useThemeContext();

  return (
    <div
      className={clsx(
        "prime-panel flex flex-col",
        cardSkin === "shadow"
          ? "shadow-soft dark:shadow-dark-900/60"
          : "dark:border-dark-600/80 ltr:border-r rtl:border-l",
      )}
    >
      <div
        className={clsx(
          "flex h-full grow flex-col bg-white ltr:pl-(--main-panel-width) rtl:pr-(--main-panel-width)",
          cardSkin === "shadow" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        <Header />
        {/* Sidebar Content */}
        <ScrollShadow className="hide-scrollbar grow overflow-y-auto">
          <div className="px-4 pt-2">
            <Button variant="outlined" className="w-full gap-2 rounded-full">
              <ViewColumnsIcon className="size-4" />
              <span>My Plan</span>
            </Button>
          </div>
          <Boards />
          <div className="mx-4 my-4 h-px bg-gray-200 dark:bg-dark-500" />
          <Workspaces />
        </ScrollShadow>
        <Footer />
      </div>
    </div>
  );
}
