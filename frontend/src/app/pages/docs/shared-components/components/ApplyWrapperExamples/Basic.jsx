// Import Dependencies
import { useState } from "react";

// Local Imports
import { ApplyWrapper } from "components/shared/ApplyWrapper";
import { Badge, Button } from "components/ui";

// ----------------------------------------------------------------------

export function Basic() {
  const [state, setState] = useState(false);

  return (
    <div>
      <ApplyWrapper
        when={state}
        wrapper={(children) => <Badge color="primary">{children}</Badge>}
      >
        The Content
      </ApplyWrapper>

      <div className="pt-4">
        <Button onClick={() => setState((val) => !val)}>Toggle Badge</Button>
      </div>
    </div>
  );
}
