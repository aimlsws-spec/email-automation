```jsx
import { Avatar } from "components/ui";
import { colorFromText } from "utils/colorFromText";

export function Usage() {
  const color = colorFromText("John Doe");

  return (
    <div>
      <Avatar initialColor={color} name="John Doe" />
    </div>
  );
}
```