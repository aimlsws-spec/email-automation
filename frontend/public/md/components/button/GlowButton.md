```jsx
// Import Dependencies
import { Button as HeadlessButton } from "@headlessui/react";
import { Fragment } from "react";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const GlowButton = () => {
  return (
    <div className="space-y-4">
      <div className="inline-space">
        <Button isGlow>Neutral</Button>
        <Button color="primary" isGlow>
          Primary
        </Button>
        <Button color="secondary" isGlow>
          Secondary
        </Button>
        <Button color="info" isGlow>
          Info
        </Button>
        <Button color="success" isGlow>
          Success
        </Button>
        <Button color="warning" isGlow>
          Warning
        </Button>
        <Button color="error" isGlow>
          Error
        </Button>
      </div>
      <div className="inline-space">
        <HeadlessButton as={Fragment}>
          {({ hover, active }) => (
            <Button color="primary" isGlow={hover && !active}>
              Neutral
            </Button>
          )}
        </HeadlessButton>
        <HeadlessButton as={Fragment}>
          {({ hover, active }) => (
            <Button color="secondary" isGlow={hover && !active}>
              Neutral
            </Button>
          )}
        </HeadlessButton>
        <HeadlessButton as={Fragment}>
          {({ hover, active }) => (
            <Button color="info" isGlow={hover && !active}>
              Neutral
            </Button>
          )}
        </HeadlessButton>
        <HeadlessButton as={Fragment}>
          {({ hover, active }) => (
            <Button color="success" isGlow={hover && !active}>
              Neutral
            </Button>
          )}
        </HeadlessButton>
        <HeadlessButton as={Fragment}>
          {({ hover, active }) => (
            <Button color="warning" isGlow={hover && !active}>
              Neutral
            </Button>
          )}
        </HeadlessButton>
        <HeadlessButton as={Fragment}>
          {({ hover, active }) => (
            <Button color="error" isGlow={hover && !active}>
              Neutral
            </Button>
          )}
        </HeadlessButton>
      </div>
    </div>
  );
};

export { GlowButton };
```