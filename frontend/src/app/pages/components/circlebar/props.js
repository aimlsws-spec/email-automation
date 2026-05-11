export const componentProps = [
    {
        componentName: "Circlebar",
        description: "A circular progress indicator with customizable styles and behavior.",
        props: [
            {
                name: "value",
                type: "number",
                default: 0,
                description: "The current progress value for the circle bar in determinate mode. Should be between 0 and 100.",
            },
            {
                name: "isIndeterminate",
                type: "boolean",
                default: false,
                description: "If true, the circle bar operates in an indeterminate mode with a looping animation.",
            },
            {
                name: "offsetDegree",
                type: "number",
                description: "The starting angle (in degrees) for the progress indicator.",
            },
            {
                name: "gapDegree",
                type: "number",
                default: 0,
                description: "The gap (in degrees) between the start and end of the progress path.",
            },
            {
                name: "gapOffsetDegree",
                type: "number",
                default: 0,
                description: "The offset (in degrees) for the gap in the progress path.",
            },
            {
                name: "strokeWidth",
                type: "number",
                default: 6,
                description: "The width of the progress stroke.",
            },
            {
                name: "strokeLinecap",
                type: "'round' | 'butt' | 'square'",
                default: "round",
                description: "Defines the shape of the stroke's end caps.",
            },
            {
                name: "isActive",
                type: "boolean",
                default: false,
                description: "If true, applies an active animation or style to the circle bar.",
            },
            {
                name: "size",
                type: "number",
                default: 24,
                description: "The size (diameter) of the circle bar, tailwind css size.",
            },
            {
                name: "showRail",
                type: "boolean",
                default: true,
                description: "If true, displays the rail (background circle) of the progress indicator.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "Custom content to render inside the circle bar.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "Specifies the color of the progress indicator.",
            },
            {
                name: "variant",
                type: "'default' | 'soft' | 'gradient'",
                default: "default",
                description: "Determines the style variant of the circle bar.",
            },
            {
                name: "contentProps",
                type: "object",
                description: "Additional props for the content element inside the circle bar.",
            },
            {
                name: "rootProps",
                type: "object",
                description: "Additional props for the root element of the circle bar.",
            },
            {
                name: "wrapperProps",
                type: "object",
                description: "Additional props for the wrapper element of the circle bar.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing CSS class names for specific parts of the component.",
            },
            {
                name: "gradient",
                type: "object",
                description: "An object containing start and end gradient colors",
            },
        ],
    }
]
