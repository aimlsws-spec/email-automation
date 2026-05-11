// Local Imports
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

export function Sender() {
  return (
    <div className="flex flex-col items-start justify-between pt-3 md:flex-row">
      <div className="flex gap-3">
        <Avatar
          size={10}
          name="Henry Curtis"
          color="warning"
          classNames={{
            display: "text-base",
          }}
        />
        <div>
          <div className="font-bold text-gray-800 dark:text-dark-100">
            Henry Curtis
          </div>
          <div className="mt-1 text-xs text-gray-800 dark:text-dark-100">
            Reply-To:{" "}
            <a
              href="mailto:henrycurtis@example.com"
              className="hover:underline"
            >
              henrycurtis@example.com
            </a>
          </div>
          <div className="mt-1 text-xs md:hidden">May 13, 2024, 20:15:00</div>
        </div>
      </div>
      <div className="mt-2 text-end text-xs max-md:hidden">
        May 13, 2024, 20:15:00
      </div>
    </div>
  );
}
