// Import Dependencies
import { useState } from "react";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Input } from "components/ui";

// ----------------------------------------------------------------------

export function Custom() {
  const [query, setQuery] = useState("");
  return (
    <div>
      <Input
        placeholder="Enter Text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2">
        <Highlight
          query={query}
          unstyled
          highlightClass="bg-primary-500 rounded-xs"
        >
          This is Higlightabele text
        </Highlight>
      </div>
    </div>
  );
}
