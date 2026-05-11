// Import Dependencies
import clsx from "clsx";
import { LockClosedIcon } from "@heroicons/react/24/outline";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Button } from "components/ui";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Channels } from "./Channels";
import { Menu } from "./Menu";

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
        <div className="hide-scrollbar grow overflow-y-auto">
          <div className="px-4 pt-2">
            <Button variant="outlined" className="w-full gap-2 rounded-full">
              <LockClosedIcon className="this:error size-4 stroke-2 text-this dark:text-this-lighter" />
              <span>Lock Screen</span>
            </Button>
          </div>
          <Channels />
          <div className="mx-4 my-4 h-px bg-gray-200 dark:bg-dark-500" />
          <Menu />
          <div className="p-4">
            <p>Sales Today</p>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-dark-100">
              134.55$
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
