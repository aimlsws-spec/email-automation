import { Select } from "components/ui";
import { randomId } from "utils/randomId";

const items = [
  {
    key: randomId(),
    value: "1",
    label: "Apple",
    disabled: false,
  },
  {
    key: randomId(),
    value: "2",
    label: "Orange",
    disabled: false,
  },
  {
    key: randomId(),
    value: "3",
    label: "Potato",
    disabled: true,
  },
  {
    key: randomId(),
    value: "4",
    label: "Tomato",
    disabled: false,
  },
];

const DataProp = () => {
  return (
    <div className="max-w-xl">
      <Select
        defaultValue="Potato"
        data={["Apple", "Orange", "Potato", "Tomato"]}
      />
      <Select data={items} classNames={{ root: "mt-4" }} />
    </div>
  );
};

export { DataProp };
