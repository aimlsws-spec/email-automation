```jsx
// Import Dependencies
import { useState } from "react";

// Local Imports
import { Combobox } from "components/shared/form/Combobox";

// ----------------------------------------------------------------------

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

export function StyledMultiple() {
  const [selected, setSelected] = useState([]);

  return (
    <div className="max-w-xl">
      <Combobox
        data={people}
        displayField="name"
        value={selected}
        onChange={setSelected}
        placeholder="Please Select User"
        label="Select User"
        searchFields={["name"]}
        multiple
        // Remove Item on Backspace
        inputProps={{
          onKeyDown: (event) => {
            selected.length > 0 &&
              event.keyCode === 8 &&
              event.target.value === "" &&
              setSelected((current) => current.slice(0, -1));
          },
        }}
      />
    </div>
  );
}
```