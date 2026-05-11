// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Basic() {
  return (
    <div className="max-w-xl">
      <Button onClick={() => toast("This is simple toast message")}>
        Default
      </Button>
    </div>
  );
}
