```jsx
import { Button, Card } from "components/ui";
import { useDisclosure } from "hooks";

export function Basic() {
  const [isOpen, { open, close, toggle }] = useDisclosure(true);
  return (
    <div>
      <Card className="p-4">
        {isOpen && (
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              eum culpa eligendi veritatis facilis quod temporibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              eum culpa eligendi veritatis facilis quod temporibus.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              eum culpa eligendi veritatis facilis quod temporibus.
            </p>
          </div>
        )}
        <div>isOpen: {isOpen.toString()}</div>
      </Card>

      <div className="flex gap-2 mt-4">
        <Button onClick={open}>Open</Button>
        <Button onClick={close}>Close</Button>
        <Button onClick={toggle}>Toggle</Button>
      </div>
    </div>
  );
}
```