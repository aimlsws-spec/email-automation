export const params = [
    {
        name: "initialState",
        default: false,
        type: "boolean",
        description: "Determines whether the disclosure is open by default. Set to `true` to open the disclosure initially.",
    },
    {
        name: "options",
        type: "object",
        description: "An object containing options for the disclosure component.",
    },
    {
        name: "options.onOpen",
        type: "function",
        description: "A callback function that is triggered when the disclosure is opened.",
    },
    {
        name: "options.onClose",
        type: "function",
        description: "A callback function that is triggered when the disclosure is closed.",
    },
];
