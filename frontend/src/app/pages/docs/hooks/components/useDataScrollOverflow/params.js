export const params = [
    {
        name: "isEnabled",
        type: "boolean",
        description: "Determines whether the overflow check is enabled or disabled.",
    },
    {
        name: "overflowCheck",
        type: "'vertical' | 'horizontal' | 'both'",
        description: "Specifies the direction(s) to check for overflow: 'vertical', 'horizontal', or 'both'.",
    },
    {
        name: "offset",
        type: "number",
        description: "The offset value used when checking for overflow.",
    },
];
