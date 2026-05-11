```jsx
import { Button } from "components/ui";
import { useToggle } from "hooks";

export function Basic() {
  const [value, toggle] = useToggle();

  return (
    <div>
      <div>Current value: {value.toString()}</div>

      <Button className="mt-2" onClick={toggle}>
        Toggle
      </Button>
    </div>
  );
}
```