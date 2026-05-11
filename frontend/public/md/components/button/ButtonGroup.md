```jsx
// Local Imports
import { Button } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

const ButtonGroup = () => {
  const { isRtl } = useLocaleContext();

  const onKeyDown = createScopedKeydownHandler({
    siblingSelector: ".btn-base",
    parentSelector: "[data-button-group]",
    activateOnFocus: false,
    loop: true,
    orientation: "horizontal",
    dir: isRtl ? "rtl" : "ltr",
  });

  return (
    <div
      className="flex flex-wrap -space-x-px "
      data-button-group
    >
      <Button
        variant="outlined"
        className="ltr:rounded-r-none rtl:rounded-l-none"
        onKeyDown={onKeyDown}
      >
        Import
      </Button>
      <Button
        variant="outlined"
        className="rounded-none px-5 py-2"
        onKeyDown={onKeyDown}
      >
        Export
      </Button>
      <Button
        variant="outlined"
        className="ltr:rounded-l-none rtl:rounded-r-none"
        onKeyDown={onKeyDown}
      >
        Print
      </Button>
    </div>
  );
};

export { ButtonGroup };

```