import { Avatar } from "components/ui";
import { Delayed } from "components/shared/Delayed";

export function Basic() {
  return (
    <div>
      <Delayed wait={1000}>
        <Avatar name="John Doe" />
      </Delayed>
    </div>
  );
}
