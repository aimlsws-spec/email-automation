// Import Dependencies
import clsx from "clsx";
import { useState } from "react";

// Local Imports
import { Input } from "components/ui";
import { useHighlight } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const [query, setQuery] = useState("");
  const text =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus delectus fugiat dolorem.";

  const result = useHighlight({
    text: text,
    query: query,
  });

  console.log(result);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query here"
      />

      <div className="mt-2">
        {result.map((part, index) => (
          <span
            key={index}
            className={clsx(part.match && "bg-secondary text-white")}
          >
            {part.text}
          </span>
        ))}
      </div>
    </div>
  );
}
