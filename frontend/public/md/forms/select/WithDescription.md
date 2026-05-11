```jsx
import { Select } from "components/ui";

const WithDescription = () => {
  return (
    <div className="max-w-xl">
      <Select
        description="This is a help text"
        defaultValue="Potato"
        data={["Apple", "Orange", "Potato", "Tomato"]}
      />
    </div>
  );
};

export { WithDescription };
```