```jsx

// Local Imports
import { FilePond } from "components/shared/form/Filepond";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// ----------------------------------------------------------------------

const ResponsiveGrid = () => {
  const { isXs, isMd, lgAndUp } = useBreakpointsContext();

  return (
    <div className="max-w-xl">
      <FilePond
        allowMultiple
        grid={(isXs && 1) || (isMd && 2) || (lgAndUp && 3)}
      />
    </div>
  );
};

export { ResponsiveGrid };
```