```jsx
import { Button } from "components/ui";

const Gradient = () => {
  return (
    <div className="inline-space">
      <Button
        unstyled
        className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-2 text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px"
      >
        Gradient
      </Button>
      <Button
        unstyled
        className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 px-5 py-2 text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px"
      >
        Gradient
      </Button>
      <Button
        unstyled
        className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-5 py-2 text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px"
      >
        Gradient
      </Button>
      <Button
        unstyled
        className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-600 px-5 py-2 text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px"
      >
        Gradient
      </Button>
      <Button
        unstyled
        className="rounded-lg bg-gradient-to-l from-pink-300 to-indigo-400 px-5 py-2 text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px"
      >
        Gradient
      </Button>
      <Button
        unstyled
        className="rounded-lg bg-gradient-to-r from-green-400 to-blue-600 px-5 py-2 text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px"
      >
        Gradient
      </Button>
    </div>
  );
};

export { Gradient };

```