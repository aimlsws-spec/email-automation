```jsx
import { Badge } from "components/ui";

const Outlined = () => {
  return (
    <div className="inline-space">
      <Badge variant="outlined" className="rounded-full">
        Neutral
      </Badge>
      <Badge variant="outlined" color="primary" className="rounded-full">
        Primary
      </Badge>
      <Badge variant="outlined" color="secondary" className="rounded-full">
        Secondary
      </Badge>
      <Badge variant="outlined" color="info" className="rounded-full">
        Info
      </Badge>
      <Badge variant="outlined" color="success" className="rounded-full">
        Success
      </Badge>
      <Badge variant="outlined" color="warning" className="rounded-full">
        Warning
      </Badge>
      <Badge variant="outlined" color="error" className="rounded-full">
        Error
      </Badge>
    </div>
  );
};

export { Outlined };
```