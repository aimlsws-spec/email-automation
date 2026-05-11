export const componentProps = [
    {
        componentName: "Timeline",
        description: "A vertical timeline component for displaying sequential events or milestones.",
        props: [
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the timeline container.",
            },
            {
                name: "pointSize",
                type: "string",
                default: "0.75rem",
                description: "The size of the points marking each timeline item.",
            },
            {
                name: "lineWidth",
                type: "string",
                default: "1px",
                description: "The thickness of the connecting line between timeline items.",
            },
            {
                name: "variant",
                type: '"filled" | "outlined"',
                default: "filled",
                description: "Specifies the style variant of the timeline.",
            },
            {
                name: "lineSpace",
                type: "string | number",
                description: "The space between the timeline line and the point.",
            },
            {
                name: "style",
                type: "React.CSSProperties",
                description: "Inline styles to apply to the timeline container.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "The timeline items to be displayed within the timeline.",
            },
        ],
    },
    {
        componentName: "TimelineItem",
        description: "An item within a timeline, representing a specific event or milestone.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content or description for the timeline item.",
            },
            {
                name: "title",
                type: "string | React.ReactNode",
                description: "The title or heading of the timeline item.",
            },
            {
                name: "time",
                type: "string | React.ReactNode",
                description: "The time or date associated with the timeline item.",
            },
            {
                name: "point",
                type: "React.ReactNode",
                description: "Custom content to use as the timeline point.",
            },
            {
                name: "color",
                type: "string",
                default: "neutral",
                description: "The color theme for the timeline point and line.",
            },
            {
                name: "variant",
                type: '"filled" | "outlined"',
                default: "filled",
                description: "Specifies the style variant of the timeline item.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the timeline item container.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing class names for specific parts of the timeline item.",
            },
            {
                name: "isPing",
                type: "boolean",
                default: "false",
                description: "Applies a ping animation to the timeline point if set to true.",
            },
        ],
    },
];
