```jsx
import { DatePicker } from "components/shared/form/Datepicker";

const Multiple = () => {
  return (
    <div className="max-w-xl">
      <DatePicker
        options={{
          mode: "multiple",
          dateFormat: "Y-m-d",
          defaultDate: ["2022-10-10", "2022-10-12", "2022-10-18"],
        }}
        placeholder="Choose date..."
      />
    </div>
  );
};

export { Multiple };
```