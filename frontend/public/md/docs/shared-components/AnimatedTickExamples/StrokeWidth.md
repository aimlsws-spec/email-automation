```jsx
import { AnimatedTick } from "components/shared/AnimatedTick";

export function StrokeWidth() {
  return (
    <div className="flex gap-4">
      <AnimatedTick strokeWidth={4} className="size-9" />
      <AnimatedTick strokeWidth={6} className="size-9" />
      <AnimatedTick strokeWidth={8} className="size-9" />
      <AnimatedTick strokeWidth={10} className="size-9" />
      <AnimatedTick strokeWidth={12} className="size-9" />
    </div>
  );
}
```