// Local Imports
import { Collapse, Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const [isExpanded, { toggle }] = useDisclosure();

  return (
    <div className="max-w-xl">
      <Button onClick={toggle} color="primary">
        Toggle
      </Button>
      <div className="mt-2">
        <Collapse in={isExpanded}>
          <p>
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
