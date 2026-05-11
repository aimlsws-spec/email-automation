```jsx
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

const browser = getUserAgentBrowser();

export function Usage() {
  return (
    <div>
      Your Browser: <span className="font-bold">{browser}</span>
    </div>
  );
}
```