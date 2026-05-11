// Import Dependencies
import { useState } from "react";

// Local Imports
import { Button } from "components/ui";
import { useDocumentTitle } from "hooks";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

export function Basic() {
  const [title, setTitle] = useState("Doc title");
  useDocumentTitle(title);

  return (
    <div>
      <Button onClick={() => setTitle(randomId())}>Set Random Title</Button>
    </div>
  );
}
