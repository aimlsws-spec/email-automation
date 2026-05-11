```jsx
// Local Imports
import { Checkbox } from "components/ui";
import { randomId } from "utils/randomId";
import { useListState } from "hooks";

// ----------------------------------------------------------------------

const initialValues = [
  { value: "svelte", label: "Svelte", checked: false, key: randomId() },
  { value: "react", label: "React", checked: true, key: randomId() },
  { value: "vue", label: "Vue", checked: false, key: randomId() },
  { value: "solid", label: "Solid", checked: false, key: randomId() },
];

const CheckboxGroup = () => {
  const [values, handlers] = useListState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((val, i) => (
    <Checkbox
      label={val.label}
      key={val.key}
      checked={val.checked}
      onChange={(e) =>
        handlers.setItemProp(i, "checked", e.currentTarget.checked)
      }
    />
  ));

  return (
    <div className="max-w-xl">
      <Checkbox
        color="error"
        label="Check All"
        indeterminate={indeterminate}
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
        checked={allChecked}
      />
      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
      <div className="flex flex-wrap gap-6">{items}</div>
    </div>
  );
};

export { CheckboxGroup };
```