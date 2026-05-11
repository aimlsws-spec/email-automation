import { Button } from "components/ui";
import { COLORS } from "constants/app.constant";
import { useToggle } from "hooks";

export function CustomValue() {
  const [value, toggle] = useToggle(COLORS);

  return (
    <div>
      <div>Current value: {value}</div>

      <Button className="mt-2" onClick={toggle} color={value}>
        Toggle
      </Button>
    </div>
  );
}
