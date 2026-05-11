import { DatePicker } from "components/shared/form/Datepicker";

const Timepicker = () => {
  return (
    <div className="max-w-xl">
      <DatePicker
        options={{
          enableTime: true,
          noCalendar: true,
        }}
        placeholder="Choose date..."
      />
    </div>
  );
};

export { Timepicker };
