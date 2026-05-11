export const componentProps = [
    {
        componentName: "Highlight",
        desc: "A component for highlighting specific text within a given content.",
        props: [
            {
                name: "query",
                type: "string",
                description: "The text or pattern to be highlighted within the content.",
            },
            {
                name: "unstyled",
                type: "boolean",
                description: "Determines whether the highlighted text should have default styling or custom styling.",
            },
            {
                name: "highlightClass",
                type: "string",
                description: "The CSS class to be applied to the highlighted portion of the text.",
            },
        ],
    },
];
