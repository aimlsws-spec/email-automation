// Import Dependencies
import { useState } from "react";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Input } from "components/ui";

// ----------------------------------------------------------------------

export function Basic() {
  const [query, setQuery] = useState("");
  return (
    <div>
      <Input
        placeholder="Enter Text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2">
        <Highlight query={query}>This is Higlightabele text</Highlight>
      </div>
    </div>
  );
}
