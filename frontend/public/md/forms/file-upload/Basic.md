```jsx
// Import Dependencies
import {
  ArrowUpTrayIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Upload, Button } from "components/ui";

// ----------------------------------------------------------------------

const Basic = () => {
  return (
    <div className="max-w-xl">
      <div className="inline-space flex flex-wrap">
        <Upload>
          {({ ...props }) => (
            <Button {...props} className="space-x-2 ">
              <ArrowUpTrayIcon className="size-5" />
              <span>Choose File</span>
            </Button>
          )}
        </Upload>
        <Upload>
          {({ ...props }) => (
            <Button
              color="primary"
              {...props}
              className="space-x-2 "
            >
              <CloudArrowUpIcon className="size-5" />
              <span>Choose File</span>
            </Button>
          )}
        </Upload>
        <Upload>
          {({ ...props }) => (
            <Button variant="outlined" {...props}>
              <ArrowUpOnSquareIcon className="size-5" />
            </Button>
          )}
        </Upload>
        <Upload>
          {({ ...props }) => (
            <Button
              color="info"
              className="size-9 shrink-0 rounded-full p-0"
              {...props}
            >
              <ArrowUpTrayIcon className="size-4 stroke-2" />
            </Button>
          )}
        </Upload>
      </div>
    </div>
  );
};

export { Basic };
```