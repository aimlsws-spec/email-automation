// Local Imports
import { Button, Switch, Textarea } from "components/ui";

// ----------------------------------------------------------------------

export function Reply() {
  return (
    <div className="mt-6">
      <Textarea placeholder="Reply to Henry Curtis..." rows="5"></Textarea>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Switch variant="outlined" label="Mute This Thread" />
        <Button color="primary">Send</Button>
      </div>
    </div>
  );
}
