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

export function StyledError() {
  const [selected, setSelected] = useState([]);

  return (
    <div className="max-w-xl">
      <Combobox
        error="Something went wrong"
        data={people}
        displayField="name"
        value={selected}
        onChange={setSelected}
        placeholder="Please Select User"
        label="Select User"
        searchFields={["name"]}
      />
    </div>
  );
}
