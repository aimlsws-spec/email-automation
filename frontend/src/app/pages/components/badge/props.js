export const componentProps = [
    {
        componentName: "Badge",
        description: "A small component used to highlight or label elements with optional styling.",
        props: [
            {
                name: "component",
                type: "string | React.ElementType",
                default: "span",
                description: "Custom component or HTML element to render the badge.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the badge element.",
            },
            {
                name: "unstyled",
                type: "boolean",
                default: false,
                description: "If true, renders the badge without any predefined styles.",
            },
            {
                name: "variant",
                type: '"filled" | "outlined" | "soft"',
                default: "filled",
                description: "Specifies the style variant of the badge.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "Specifies the color theme of the badge.",
            },
            {
                name: "isGlow",
                type: "boolean",
                default: false,
                description: "Applies a glowing effect to the badge if set to true.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to be displayed inside the badge.",
            },
        ],
    },
];
