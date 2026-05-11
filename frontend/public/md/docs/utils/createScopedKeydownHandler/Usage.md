```jsx
// Local Imports
import { Button } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { range } from "utils/range";

// ----------------------------------------------------------------------


export function Usage() {
  const items = range(1, 6);

  return (
    <div className="flex flex-col items-start space-y-2" data-menu>
      {items.map((item) => (
        <Button
          key={item}
          data-menu-item
          color="primary"
          onKeyDown={createScopedKeydownHandler({
            siblingSelector: "[data-menu-item]",
            parentSelector: "[data-menu]",
            activateOnFocus: false,
            loop: true,
            orientation: "vertical",
          })}
        >
          Item {item}
        </Button>
      ))}
    </div>
  );
}
```