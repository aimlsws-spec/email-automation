export const params = [
    {
        name: "bytes",
        type: "number",
        description: "The number of bytes to format."
    },
    {
        name: "base",
        type: "number",
        default: '1000',
        description: "The base value for the unit conversion (e.g., 1000 for decimal, 1024 for binary)."
    },
    {
        name: "precision",
        type: "number",
        default: '2',
        description: "The number of decimal places to include in the formatted output."
    },
]