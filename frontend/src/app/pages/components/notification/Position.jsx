// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export function Position() {
  const { setNotificationPosition } = useThemeContext();

  return (
    <div className="inline-space max-w-xl">
      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationPosition("top-left");
        }}
      >
        Top Left
      </Button>
      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationPosition("top-center");
        }}
      >
        Top Center
      </Button>
      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationPosition("top-right");
        }}
      >
        Top Right
      </Button>
      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationPosition("bottom-left");
        }}
      >
        Bottom Left
      </Button>

      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationPosition("bottom-center");
        }}
      >
        Bottom Center
      </Button>

      <Button
        onClick={() => {
          toast("This is simple toast message");
          setNotificationPosition("bottom-right");
        }}
      >
        Bottom Right
      </Button>
    </div>
  );
}
