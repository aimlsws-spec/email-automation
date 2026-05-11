```jsx
import { useMediaQuery } from "hooks";

export function Basic() {
  const isMatch = useMediaQuery("(min-width: 768px)");

  return (
    <div>
      {`The view port is ${isMatch ? "at least" : "less than"} 768 pixels wide`}
    </div>
  );
}
```