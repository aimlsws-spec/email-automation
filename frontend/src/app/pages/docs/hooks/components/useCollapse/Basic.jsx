// Import Dependencies
import { useState } from "react";

// Local Imports
import { Box, Button } from "components/ui";
import { useCollapse } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const [opened, setOpened] = useState(false);
  const getCollapseProps = useCollapse({ opened });

  return (
    <div>
      <div {...getCollapseProps()}>
        <Box className="max-w-sm rounded-lg bg-linear-to-r from-amber-400 to-orange-600 p-1">
          <Box className="rounded-lg bg-gray-50 px-4 py-4 dark:bg-dark-900 sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                The Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>
        </Box>
      </div>
      <Button className="mt-2" onClick={() => setOpened((val) => !val)}>
        Toggle
      </Button>
    </div>
  );
}
