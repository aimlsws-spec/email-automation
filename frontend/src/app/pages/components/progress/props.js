export const componentProps = [
    {
        componentName: "Progress",
        description: "A component for displaying progress, supporting determinate and indeterminate modes.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "Custom content or additional elements to render inside the progress bar.",
            },
            {
                name: "value",
                type: "number",
                default: 0,
                description: "The current value of the progress bar in determinate mode. Should be between 0 and 100.",
            },
            {
                name: "showRail",
                type: "boolean",
                default: true,
                description: "Whether to display the rail (background) of the progress bar.",
            },
            {
                name: "isActive",
                type: "boolean",
                default: false,
                description: "If true, applies an active animation or style to the progress bar.",
            },
            {
                name: "isIndeterminate",
                type: "boolean",
                default: false,
                description: "If true, the progress bar operates in indeterminate mode, showing a looping animation instead of specific progress.",
            },
            {
                name: "unstyled",
                type: "boolean",
                default: false,
                description: "If true, allowing full customization.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "Specifies the color of the progress bar. Can use theme colors.",
            },
            {
                name: "variant",
                type: "'soft' | 'default'",
                default: "default",
                description: "Determines the style variant of the progress bar.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root progress bar.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing class names for specific parts of the progress bar, such as rail or indicator.",
            },
            {
                name: "animationDuration",
                type: "string",
                default: "1500ms",
                description: "The duration of the animation for progress",
            },
            {
                name: "style",
                type: "React.CSSProperties",
                description: "Inline styles to apply to the root progress bar element.",
            },
            {
                name: "rootProps",
                type: "object",
                description: "Additional props to pass to the root element of the progress bar.",
            },
        ],
    }
]
