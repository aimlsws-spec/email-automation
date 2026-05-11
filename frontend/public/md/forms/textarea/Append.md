```jsx
// Import Dependencies
import {
  PaperClipIcon,
  MicrophoneIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Textarea, Avatar, Button, AvatarDot } from "components/ui";

// ----------------------------------------------------------------------

const Append = () => {
  return (
    <div className="max-w-xl">
      <div className="flex space-x-4 overflow-x-auto ">
        <Avatar size={10} src="/images/avatar/avatar-20.jpg">
          <AvatarDot color="info" className="right-0 -m-px size-3" />
        </Avatar>

        <div className="w-full rounded-lg border border-gray-300 transition-colors focus-within:!border-primary-600 hover:border-gray-400 dark:border-dark-450 dark:focus-within:!border-primary-500 dark:hover:border-dark-400">
          <Textarea
            rows="6"
            placeholder="Post Content"
            unstyled
            className="resize-none bg-transparent px-3 pt-2 placeholder:font-light placeholder:text-gray-600 dark:placeholder:text-dark-200"
          />
          <div className="flex items-end justify-between p-2">
            <div className="flex space-x-1 ">
              <Button variant="flat" isIcon className="size-8 rounded-full">
                <PaperClipIcon className="size-5" />
              </Button>
              <Button variant="flat" isIcon className="size-8 rounded-full">
                <MicrophoneIcon className="size-5" />
              </Button>
              <Button variant="flat" isIcon className="size-8 rounded-full">
                <FaceSmileIcon className="size-5" />
              </Button>
            </div>
            <Button color="primary" className="text-xs-plus">
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Append };
```