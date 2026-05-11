// Import Dependencies
import clsx from "clsx";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Header } from "./Header";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import { Recent } from "./Recent";

// ----------------------------------------------------------------------

export function SidebarPanel() {
  const { cardSkin } = useThemeContext();

  return (
    <div
      className={clsx(
        "prime-panel flex flex-col",
        cardSkin === "shadow"
          ? "shadow-soft dark:shadow-dark-900/60"
          : "border-gray-200 dark:border-dark-600/80 ltr:border-r rtl:border-l",
      )}
    >
      <div
        className={clsx(
          "flex h-full grow flex-col bg-white ltr:pl-(--main-panel-width) rtl:pr-(--main-panel-width)",
          cardSkin === "shadow" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        <Header />
        <Menu />
        <div className="mx-4 my-3 h-px shrink-0 bg-gray-200 dark:bg-dark-500"></div>
        <Recent />
        <Footer />
      </div>
    </div>
  );
}
