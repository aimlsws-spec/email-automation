export const params = [
    {
        name: "num",
        type: "number",
        description: "The number to format."
    },
    {
        name: "base",
        type: "number",
        default: '1000',
        description: "The number of decimal places to include in the formatted output."
    },
    {
        name: "precision",
        type: "number",
        default: '2',
        description: "The number of decimal places to include in the formatted output."
    },
]