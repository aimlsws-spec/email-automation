// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export function Expand() {
  const { setNotificationExpand } = useThemeContext();

  return (
    <div className="inline-space max-w-xl">
      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationExpand(true);
        }}
      >
        Expanded
      </Button>
      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationExpand(false);
        }}
      >
        Stacked
      </Button>
    </div>
  );
}
