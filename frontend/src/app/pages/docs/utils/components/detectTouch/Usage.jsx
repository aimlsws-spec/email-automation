import { detectTouch } from "utils/dom/detectTouch";

const isTouchable = detectTouch();

export function Usage() {
  return (
    <div>
      Your device is{" "}
      <span className="font-bold">
        {isTouchable ? "touchable" : "not touchable"}
      </span>
    </div>
  );
}
