// Import Dependencies
import clsx from "clsx";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Header } from "./Header";
import { Histories } from "./Histories";
import { Chats } from "./Chats";
import { Footer } from "./Footer";

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
        <Histories />
        <Chats />
        <Footer />
      </div>
    </div>
  );
}
