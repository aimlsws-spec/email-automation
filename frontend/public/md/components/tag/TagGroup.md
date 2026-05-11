```jsx
// Import Dependencies
import { HeartIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Tag } from "components/ui";

const TagGroup = () => {
  return (
    <div className="inline-space flex flex-wrap items-end">
      <div className="inline-flex">
        <Tag href="#" className="ltr:rounded-r-none rtl:rounded-l-none">
          Primary
        </Tag>
        <Tag
          href="#"
          color="primary"
          className="ltr:rounded-l-none rtl:rounded-r-none"
        >
          55
        </Tag>
      </div>
      <div className="inline-flex">
        <Tag
          href="#"
          color="info"
          variant="soft"
          className="ltr:rounded-r-none rtl:rounded-l-none"
        >
          Message
        </Tag>
        <Tag
          href="#"
          color="info"
          className="ltr:rounded-l-none rtl:rounded-r-none"
        >
          32
        </Tag>
      </div>
      <div className="inline-flex">
        <Tag
          href="#"
          color="success"
          variant="soft"
          className="ltr:rounded-r-none rtl:rounded-l-none"
        >
          Message
        </Tag>
        <Tag
          href="#"
          color="success"
          isGlow
          className="ltr:rounded-l-none rtl:rounded-r-none"
        >
          32
        </Tag>
      </div>
      <div className="inline-flex">
        <Tag
          href="#"
          color="warning"
          variant="outlined"
          className="ltr:rounded-r-none rtl:rounded-l-none"
        >
          Warning
        </Tag>
        <Tag
          href="#"
          color="warning"
          className="ltr:rounded-l-none rtl:rounded-r-none"
        >
          32
        </Tag>
      </div>
      <Tag href="#" className="gap-2">
        <HeartIcon className="size-4.5 stroke-2 text-secondary dark:text-secondary-lighter" />
        <span>Sponsor</span>
      </Tag>
      <Tag
        href="#"
        unstyled
        className="rounded bg-gray-200 px-2 py-1.5 text-xs text-gray-900"
      >
        Light
      </Tag>
      <Tag
        href="#"
        unstyled
        className="rounded bg-dark-800 px-2 py-1.5 text-xs text-white"
      >
        Dark
      </Tag>
    </div>
  );
};

export { TagGroup };
```