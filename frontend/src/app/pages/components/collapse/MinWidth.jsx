// Import Dependencies
import clsx from "clsx";
import { useState } from "react";

// Local Imports
import { Collapse, Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function MinWidth() {
  const [isExpanded, { toggle }] = useDisclosure();
  const [truncate, setTruncate] = useState(true);

  return (
    <div className="max-w-xl">
      <Button onClick={toggle} color="primary">
        Toggle
      </Button>
      <div className="mt-2">
        <Collapse
          in={isExpanded}
          min="20px"
          onTransitionEnd={() =>
            isExpanded ? setTruncate(false) : setTruncate(true)
          }
        >
          <p className={clsx(truncate && !isExpanded && "truncate")}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
            libero cum repellat saepe aut architecto aliquid accusantium
            excepturi dicta illo consectetur veniam alias illum labore, eveniet
            repellendus reiciendis incidunt reprehenderit aliquam laborum
            debitis, quos assumenda porro fugiat! Debitis quam aliquid, ut
            sapiente, reprehenderit pariatur, vitae odio repudiandae veniam
            repellendus non!
          </p>
        </Collapse>
      </div>
    </div>
  );
}
