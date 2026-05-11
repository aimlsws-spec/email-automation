export const componentProps = [
    {
        componentName: "Table",
        description: "Table can be used to show a list of data in a table format.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "Content to be rendered within the table, typically rows and columns.",
            },
            {
                name: "component",
                type: "string | React.ElementType",
                default: "table",
                description: "Custom component or HTML element to use as the table.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the table element.",
            },
            {
                name: "hoverable",
                type: "boolean",
                description: "Enables hover effect on rows for better user interaction feedback.",
            },
            {
                name: "zebra",
                type: "boolean",
                description: "Applies alternating row colors (zebra stripes) for improved readability.",
            },
            {
                name: "dense",
                type: "boolean",
                description: "Reduces the padding in the table for a more compact layout.",
            },
            {
                name: "sticky",
                type: "boolean",
                description: "Keeps the table header or specific columns fixed while scrolling.",
            },
        ]
    },
]
