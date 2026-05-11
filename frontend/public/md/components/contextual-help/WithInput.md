```jsx
import { ContextualHelp } from "components/shared/ContextualHelp";
import { Input } from "components/ui";

export function WithInput() {
  return (
    <div className="max-w-xl">
      <Input
        placeholder="Enter Username"
        label="Your name:"
        suffix={
          <ContextualHelp
            title="What is a segment?"
            anchor={{ to: "bottom end", gap: 12 }}
            content={
              <p>
                Segments identify who your visitors are, what devices and
                services they use, where they navigated from, and much more.
              </p>
            }
          />
        }
      />
    </div>
  );
}
```