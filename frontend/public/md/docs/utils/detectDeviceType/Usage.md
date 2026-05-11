```jsx
import { detectDeviceType } from "utils/dom/detectDeviceType";

const device = detectDeviceType();

export function Usage() {
  return (
    <div>
      Your device: <span className="font-bold">{device}</span>
    </div>
  );
}
```