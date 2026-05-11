```jsx
import { Button } from "components/ui";

const OutlinedGradient = () => {
  return (
    <div className="inline-space">
      <Button
        unstyled
        className="group h-10 rounded-lg bg-gradient-to-r from-amber-400 to-orange-600 p-0.5 duration-100 ease-out [contain:paint] active:translate-y-px"
      >
        <span className="inline-flex h-full items-center justify-center rounded-lg bg-white px-5 transition-colors hover:text-white group-hover:bg-transparent group-hover:text-white group-focus:bg-transparent group-focus:text-white dark:bg-dark-700">
          Outlined
        </span>
      </Button>

      <Button
        unstyled
        className="group h-10 rounded-lg  bg-gradient-to-r from-sky-400 to-blue-600 p-0.5 duration-100 ease-out [contain:paint] active:translate-y-px"
      >
        <span className="inline-flex h-full items-center justify-center rounded-lg bg-white px-5 transition-colors hover:text-white group-hover:bg-transparent group-hover:text-white group-focus:bg-transparent group-focus:text-white dark:bg-dark-700">
          Outlined
        </span>
      </Button>

      <Button
        unstyled
        className="group h-10 rounded-lg  bg-gradient-to-l from-pink-300 to-indigo-400 p-0.5 duration-100 ease-out [contain:paint] active:translate-y-px"
      >
        <span className="inline-flex h-full items-center justify-center rounded-lg bg-white px-5 transition-colors hover:text-white group-hover:bg-transparent group-hover:text-white group-focus:bg-transparent group-focus:text-white dark:bg-dark-700">
          Outlined
        </span>
      </Button>

      <Button
        unstyled
        className="group h-10 rounded-lg bg-gradient-to-r from-green-400 to-fuchsia-400 p-0.5 duration-100 ease-out [contain:paint] active:translate-y-px"
      >
        <span className="inline-flex h-full items-center justify-center rounded-lg bg-white px-5 transition-colors hover:text-white group-hover:bg-transparent group-hover:text-white group-focus:bg-transparent group-focus:text-white dark:bg-dark-700">
          Outlined
        </span>
      </Button>
      <Button
        unstyled
        className="group h-10 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 p-0.5 duration-100 ease-out [contain:paint] active:translate-y-px"
      >
        <span className="inline-flex h-full items-center justify-center rounded-lg bg-white px-5 transition-colors hover:text-white group-hover:bg-transparent group-hover:text-white group-focus:bg-transparent group-focus:text-white dark:bg-dark-700">
          Outlined
        </span>
      </Button>
    </div>
  );
};

export { OutlinedGradient };

```