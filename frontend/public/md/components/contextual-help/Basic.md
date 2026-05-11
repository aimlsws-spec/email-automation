```jsx
import { ContextualHelp } from "components/shared/ContextualHelp";

export function Basic() {
  return (
    <div>
      <ContextualHelp
        title="What is a Contextual help ?"
        content={
          <p>
            Contextual help shows a user extra information about the state of an
            adjacent component, or a total view.
          </p>
        }
      />
    </div>
  );
}
```