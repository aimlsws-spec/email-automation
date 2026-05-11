```jsx
// Import Dependencies
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Color() {
  return (
    <div className="inline-space max-w-xl">
      <Button onClick={() => toast.success("Todo has been created")}>
        Success
      </Button>
      <Button onClick={() => toast.error("Oops... Something went wrong")}>
        Error
      </Button>
      <Button
        onClick={() =>
          toast.success("Todo has been created", {
            className: "soft-color",
          })
        }
      >
        Success Soft
      </Button>
      <Button
        onClick={() =>
          toast.error("Oops... Something went wrong", {
            className: "soft-color",
          })
        }
      >
        Error Soft
      </Button>
    </div>
  );
}
```