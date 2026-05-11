// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Gallery() {
  return (
    <Card className="p-3">
      <div className="grid grid-cols-3 gap-3">
        <img
          src="/images/objects/object-3.jpg"
          className="rounded-lg object-cover object-center"
          alt="galley item"
        />
        <img
          src="/images/objects/object-4.jpg"
          className="rounded-lg object-cover object-center"
          alt="galley item"
        />
        <img
          src="/images/objects/object-5.jpg"
          className="rounded-lg object-cover object-center"
          alt="galley item"
        />
        <img
          src="/images/objects/object-9.jpg"
          className="rounded-lg object-cover object-center"
          alt="galley item"
        />
        <img
          src="/images/objects/object-8.jpg"
          className="rounded-lg object-cover object-center"
          alt="galley item"
        />
        <img
          src="/images/objects/object-7.jpg"
          className="rounded-lg object-cover object-center"
          alt="galley item"
        />
      </div>
    </Card>
  );
}
