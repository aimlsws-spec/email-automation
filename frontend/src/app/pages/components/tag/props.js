export const componentProps = [
    {
        componentName: "Tag",
        description: "A component used to categorize or label elements with customizable styling.",
        props: [
            {
                name: "component",
                type: "string | React.ElementType",
                default: "a",
                description: "Custom component or HTML element to render the tag.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the tag element.",
            },
            {
                name: "unstyled",
                type: "boolean",
                default: false,
                description: "If true, renders the tag without any predefined styles.",
            },
            {
                name: "variant",
                type: '"filled" | "outlined" | "soft"',
                default: "filled",
                description: "Specifies the style variant of the tag.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "Specifies the color theme of the tag.",
            },
            {
                name: "isGlow",
                type: "boolean",
                default: false,
                description: "Applies a glowing effect to the tag if set to true.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to be displayed inside the tag.",
            },
        ],
    },
];
