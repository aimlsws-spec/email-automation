// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function InstagramPost() {
  return (
    <Card className="p-3">
      <img
        className="h-48 w-full rounded-lg object-cover object-center"
        src="/images/objects/object-3.jpg"
        alt="post"
      />
      <div className="mt-3">
        <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          ❤ Instagram Post
        </p>
        <p className="mt-1 text-xs-plus">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit?
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <a
            href="##"
            className="text-xs-plus text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
          >
            #PHP
          </a>
          <a
            href="##"
            className="text-xs-plus text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
          >
            #ReactJS
          </a>
          <a
            href="##"
            className="text-xs-plus text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
          >
            #NextJS
          </a>
        </div>
      </div>
    </Card>
  );
}
