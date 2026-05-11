export const params = [
    {
      name: "transitionDuration",
      type: "number",
      description:
        "The duration of the transition in milliseconds. By default, it depends on the element's height, with a minimum value of 500ms.",
    },
    {
      name: "transitionTimingFunction",
      type: "string",
      default: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      description:
        "The timing function for the transition.",
    },
    {
      name: "onTransitionEnd",
      type: "function",
      description: "A callback function triggered when the transition ends.",
    },
    {
      name: "opened",
      type: "boolean",
      description: "Indicates whether the collapse is open or closed.",
    },
    {
      name: "min",
      type: "string",
      default: "0px",
      description: "The minimum height value for the collapsible element.",
    },
  ];
  