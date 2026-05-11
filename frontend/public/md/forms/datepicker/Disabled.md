```jsx
import { DatePicker } from "components/shared/form/Datepicker";

const Disabled = () => {
  return (
    <div className="max-w-xl">
      <DatePicker
        options={{
          disable: [
            function (date) {
              return date.getDay() === 0 || date.getDay() === 6;
            },
          ],
          locale: {
            firstDayOfWeek: 1,
          },
        }}
        placeholder="Choose date..."
      />
    </div>
  );
};

export { Disabled };
```