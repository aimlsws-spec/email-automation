// Local Imports
import { Collapse, Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function TimingFunction() {
  const [isExpanded, { toggle }] = useDisclosure();

  return (
    <div className="max-w-xl">
      <Button onClick={toggle} color="primary">
        Toggle
      </Button>
      <div className="pt-2">
        <Collapse
          in={isExpanded}
          transitionTimingFunction="cubic-bezier(0.175, 0.885, 0.320, 1.275)"
        >
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
      <div className="pt-2">The content after collapse</div>
    </div>
  );
}
