```jsx
// Import Dependencies
import { useEffect } from "react";
import { toast } from "sonner";

// Local Imports
import { Button } from "components/ui";
import { useClipboard } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const { copy, copied } = useClipboard();

  useEffect(() => {
    if (copied) {
      toast("Copied!");
    }
  }, [copied]);

  return (
    <div>
      <Button onClick={() => copy("Copy Clipboard")}>Copy Clipboard</Button>
    </div>
  );
}
```