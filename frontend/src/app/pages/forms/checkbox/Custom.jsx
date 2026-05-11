// Import Dependencies
import { RiSvelteLine, RiReactjsLine, RiVuejsLine } from "react-icons/ri";
import { TbBrandSolidjs } from "react-icons/tb";
import clsx from "clsx";

// Local Imports
import { Checkbox } from "components/ui";
import { randomId } from "utils/randomId";
import { useListState } from "hooks";

// ----------------------------------------------------------------------

const initialValues = [
  {
    value: "svelte",
    icon: RiSvelteLine,
    label: "Svelte",
    checked: false,
    key: randomId(),
  },
  {
    value: "react",
    icon: RiReactjsLine,
    label: "React",
    checked: true,
    key: randomId(),
  },
  {
    value: "vue",
    icon: RiVuejsLine,
    label: "Vue",
    checked: false,
    key: randomId(),
  },
  {
    value: "solid",
    icon: TbBrandSolidjs,
    label: "Solid",
    checked: false,
    key: randomId(),
  },
];

const Custom = () => {
  const [values, handlers] = useListState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((val, i) => (
    <label
      className={clsx(
        "relative flex min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border p-3",
        val.checked
          ? "border-primary-500 ring-1 ring-primary-500/30"
          : "border-gray-200 dark:border-dark-600",
      )}
      key={val.key}
    >
      <div className="flex min-w-0 gap-2">
        <val.icon className="size-5" />
        <span>{val.label}</span>
      </div>
      <Checkbox
        className={clsx("size-4 rounded-full", !val.checked && "opacity-0")}
        checked={val.checked}
        onChange={(e) =>
          handlers.setItemProp(i, "checked", e.currentTarget.checked)
        }
      />
    </label>
  ));

  return (
    <div className="max-w-xl">
      <Checkbox
        color="error"
        label="Check All"
        indeterminate={indeterminate}
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked })),
          )
        }
        checked={allChecked}
      />
      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{items}</div>
    </div>
  );
};

export { Custom };
