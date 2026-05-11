export const componentProps = [
    {
        componentName: "ScrollShadow",
        description: "A component that adds shadow-sm effects to the edges of scrollable content to indicate scrollable areas.",
        props: [
            {
                name: "component",
                type: "string | React.ElementType",
                description: "Custom component or HTML element to render the root wrapper.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to be wrapped and have scroll shadows applied.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element for styling.",
            },
            {
                name: "size",
                type: "number",
                default: 10,
                description: "The size of the shadow-sm effect.",
            },
            {
                name: "offset",
                type: "number",
                default: 0,
                description: "The offset of the shadow-sm effect from the edges.",
            },
            {
                name: "isEnabled",
                type: "boolean",
                default: true,
                description: "If true, enables the shadow-sm effect. If false, no shadows are applied.",
            },
            {
                name: "orientation",
                type: "'vertical' | 'horizontal' | 'both'",
                default: "vertical",
                description: "Determines the orientation of the shadows (vertical, horizontal, or both).",
            },
            {
                name: "style",
                type: "React.CSSProperties",
                description: "Inline styles to apply to the element.",
            },
        ],
    }

]
