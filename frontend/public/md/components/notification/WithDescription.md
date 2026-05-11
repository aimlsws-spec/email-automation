```jsx
// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function WithDescription() {
  return (
    <div className="max-w-xl">
      <Button
        onClick={() =>
          toast("This is simple toast message", {
            description: "This is Description",
            descriptionClassName:
              "text-gray-600 dark:text-dark-200 text-xs mt-0.5",
          })
        }
      >
        Default
      </Button>
    </div>
  );
}
```