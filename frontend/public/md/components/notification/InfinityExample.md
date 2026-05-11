```jsx
// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function InfinityExample() {
  return (
    <div className="max-w-xl">
      <Button
        onClick={() =>
          toast("This is simple toast message", {
            duration: Infinity,
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Default
      </Button>
    </div>
  );
}

```