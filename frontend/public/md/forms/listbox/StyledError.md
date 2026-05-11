```jsx
// Import Dependencies
import { useState } from "react";

// Local Imports
import { Listbox } from "components/shared/form/Listbox";

// ----------------------------------------------------------------------

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

const StyledError = () => {
  const [selected, setSelected] = useState(people[0]);

  return (
    <div className="max-w-xl">
      <Listbox
        data={people}
        value={selected}
        placeholder="Select People"
        onChange={setSelected}
        error="Something went wrong"
        label="People"
        displayField="name"
      />
    </div>
  );
};

export { StyledError };
```