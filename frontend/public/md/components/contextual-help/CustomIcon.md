```jsx
// Import Dependencies
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { ContextualHelp } from "components/shared/ContextualHelp";

// ----------------------------------------------------------------------

export function CustomIcon() {
  return (
    <div className="flex space-x-2 ">
      <ContextualHelp
        Icon={ExclamationCircleIcon}
        title="What is a Contextual help ?"
        content={
          <p>
            Contextual help shows a user extra information about the state of an
            adjacent component, or a total view.
          </p>
        }
      />
      <ContextualHelp
        Icon={ExclamationTriangleIcon}
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