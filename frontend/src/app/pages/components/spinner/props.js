export const componentProps = [
    {
        componentName: "Spinner",
        description: "A loading indicator component with customizable styles and animations.",
        props: [
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the spinner component for styling.",
            },
            {
                name: "animate",
                type: "boolean",
                default: true,
                description: "If true, enables the spinning animation for the spinner.",
            },
            {
                name: "isElastic",
                type: "boolean",
                description: "If true, applies an elastic style to the spinner animation for a unique effect.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the spinner animation, rendering it as static.",
            },
            {
                name: "variant",
                type: "'default' | 'soft' | 'innerDot'",
                default: "default",
                description: "Defines the style variant of the spinner.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "Specifies the color of the spinner, using theme colors.",
            },
            {
                name: "unstyled",
                type: "boolean",
                description: "If true, removes all default styles, allowing for full customization.",
            },
        ],
    },
    {
        componentName: "GhostSpinner",
        description: "A loading spinner with customizable animation and style options.",
        props: [
            {
                name: "animate",
                type: "boolean",
                description: "If true, enables the spinning animation for the ghost spinner.",
            },
            {
                name: "isElastic",
                type: "boolean",
                description: "If true, applies an elastic style to the spinner animation for a unique effect.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the spinner animation, rendering it as static.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the ghost spinner for styling.",
            },
            {
                name: "variant",
                type: "'default' | 'soft' | 'innerDot'",
                description: "Specifies the style variant of the ghost spinner.",
            },
        ],
    }

]
