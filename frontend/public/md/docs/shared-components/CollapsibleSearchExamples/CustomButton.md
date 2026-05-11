```jsx
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";

export function CustomButton() {
  return (
    <div>
      <CollapsibleSearch
        placeholder="Search something "
        buttonProps={{
          variant: "filled",
          className: "size-9",
        }}
        className="h-9"
      />
    </div>
  );
}
```