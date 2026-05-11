export const componentProps = [
    {
        componentName: "Button",
        description: "A versatile button component supporting various styles, variants, and behaviors.",
        props: [
            {
                name: "component",
                type: "string | React.ElementType",
                default: "button",
                description: "Custom component or HTML element to render the button.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the button element.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to be displayed inside the button.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "Specifies the color theme of the button.",
            },
            {
                name: "isIcon",
                type: "boolean",
                default: false,
                description: "Indicates whether the button is styled as an icon-only button.",
            },
            {
                name: "variant",
                type: '"filled" | "outlined" | "soft" | "flat"',
                default: "filled",
                description: "Specifies the style variant of the button.",
            },
            {
                name: "unstyled",
                type: "boolean",
                default: false,
                description: "If true, renders the button without any predefined styles.",
            },
            {
                name: "type",
                type: '"button" | "submit" | "reset"',
                default: "button",
                description: "Specifies the type attribute of the button element.",
            },
            {
                name: "isGlow",
                type: "boolean",
                default: false,
                description: "Applies a glowing effect to the button if set to true.",
            },
            {
                name: "disabled",
                type: "boolean",
                default: false,
                description: "Disables the button, preventing user interaction.",
            },
        ],
    },
];
