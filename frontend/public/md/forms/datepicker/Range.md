```jsx
import { DatePicker } from "components/shared/form/Datepicker";

const Range = () => {
  return (
    <div className="max-w-xl">
      <DatePicker
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          defaultDate: ["2016-10-10", "2016-10-20"],
        }}
        placeholder="Choose date..."
      />
    </div>
  );
};

export { Range };
```