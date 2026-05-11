// Local Imports
import { Button } from "components/ui";
import { useSidebarContext } from "app/contexts/sidebar/context";

// ----------------------------------------------------------------------

export function Placeholder() {
  const { open } = useSidebarContext();
  return (
    <main className="main-content transition-content h-screen p-4 px-(--margin-x) supports-[height:1dvh]:h-dvh">
      <div className="grid h-full place-content-center place-items-center rounded-xl bg-gray-100 dark:bg-dark-800">
        <Button onClick={open} className="rounded-full px-3 py-1.5 text-xs">
          Select Chat To Start Messaging
        </Button>
      </div>
    </main>
  );
}
