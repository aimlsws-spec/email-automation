import { Button } from "components/ui";

const places = [
  "top",
  "top-start",
  "top-end",
  "right",
  "right-start",
  "right-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
];

const Placement = () => {
  return (
    <div className="grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <Button
          key={place}
          data-tooltip
          data-tooltip-content={`I'm a tooltip`}
          data-tooltip-place={place}
          className="capitalize"
        >
          {place}
        </Button>
      ))}
    </div>
  );
};

export { Placement };
