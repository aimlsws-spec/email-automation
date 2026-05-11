```jsx
import { Button, Circlebar } from "components/ui";

export function Custom() {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      <div className="rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-4 pb-4 pt-5 text-center">
        <div className="mx-8">
          <Circlebar
            value={83}
            className="[&_.circlebar-inner-path]:stroke-white/80 [&_.circlebar-rail-path]:stroke-white/20"
          >
            <span className="text-lg font-medium text-white">83%</span>
          </Circlebar>
        </div>
        <div className="mt-3 font-semibold text-white">AVG Progress</div>
        <Button
          unstyled
          className="mt-5 w-full rounded-lg border border-white/10 bg-white/20 py-2 text-white hover:bg-white/30 focus:bg-white/30"
        >
          Show Info
        </Button>
      </div>
      <div className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 px-4 pb-4 pt-5 text-center">
        <div className="mx-8">
          <Circlebar
            value={65}
            className="[&_.circlebar-inner-path]:stroke-white/80 [&_.circlebar-rail-path]:stroke-white/20"
          >
            <span className="text-lg font-medium text-white">65%</span>
          </Circlebar>
        </div>
        <div className="mt-3 font-semibold text-white">AVG Progress</div>
        <Button
          unstyled
          className="mt-5 w-full rounded-lg border border-white/10 bg-white/20 py-2 text-white hover:bg-white/30 focus:bg-white/30"
        >
          Show Info
        </Button>
      </div>
    </div>
  );
}
```