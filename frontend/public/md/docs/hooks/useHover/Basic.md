```jsx
import { Button } from "components/ui";
import { useHover } from "hooks";

export function Basic() {
  const [ref, isHovered] = useHover();

  return (
    <div>
      <Button ref={ref} isGlow={isHovered} color="primary">
        Button
      </Button>

      <div className="mt-2">{isHovered ? "Hovered" : "Not hovered"}</div>
    </div>
  );
}
```