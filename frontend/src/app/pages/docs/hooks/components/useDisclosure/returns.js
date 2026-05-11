export const returns = [
    {
        name: "state",
        type: "boolean",
        description: "The current state of the disclosure (true for open, false for closed).",
    },
    {
        name: "handlers",
        type: "object",
        description: "An object containing functions for managing the disclosure state.",
    },
    {
        name: "handlers.open",
        type: "function",
        description: "A function to open the disclosure.",
    },
    {
        name: "handlers.close",
        type: "function",
        description: "A function to close the disclosure.",
    },
    {
        name: "handlers.toggle",
        type: "function",
        description: "A function to toggle the disclosure state between open and closed.",
    },
];
