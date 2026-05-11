```jsx
// Import Dependencies
import { useState } from "react";

// Local Imports
import { Radio } from "components/ui";

// ----------------------------------------------------------------------

const Controlled = () => {
  const [selected, setSelected] = useState("vue");

  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Radio
          value="vue"
          checked={selected === "vue"}
          onChange={(event) => {
            setSelected(event.target.value);
          }}
          label="Vue"
        />
        <Radio
          value="react"
          checked={selected === "react"}
          onChange={(event) => {
            setSelected(event.target.value);
          }}
          label="React"
        />
        <Radio
          value="solid"
          checked={selected === "solid"}
          onChange={(event) => {
            setSelected(event.target.value);
          }}
          label="Solid"
        />
        <Radio
          value="svelte"
          checked={selected === "svelte"}
          onChange={(event) => {
            setSelected(event.target.value);
          }}
          label="Svelte"
        />
      </div>
      <p className="mt-1"> {selected}</p>
    </div>
  );
};

export { Controlled };
```