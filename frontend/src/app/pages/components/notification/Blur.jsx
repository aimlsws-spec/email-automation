// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export function Blur() {
  const { lightColorScheme } = useThemeContext();

  return (
    <div className="max-w-xl">
      <Button
        onClick={() =>
          toast("This is simple toast message", {
            style: {
              backgroundColor: `${lightColorScheme["100"]}20`,
              backdropFilter: "blur(6px)",
            },
          })
        }
      >
        Blur
      </Button>
    </div>
  );
}
