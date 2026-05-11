export const componentProps = [
    {
        componentName: "Collapse",
        description: "A component that toggles visibility by animating the height of its content.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to be displayed inside the collapsible area.",
            },
            {
                name: "in",
                type: "boolean",
                description: "Controls the visibility of the content. If true, the content is expanded.",
            },
            {
                name: "transitionDuration",
                type: "number | string",
                description: "Specifies the duration of the transition, in milliseconds or CSS time format.",
            },
            {
                name: "transitionTimingFunction",
                type: "string",
                description: "Defines the CSS timing function for the transition animation.",
            },
            {
                name: "min",
                type: "string | number",
                description: "The minimum height of the collapsible area when collapsed.",
            },
            {
                name: "style",
                type: "React.CSSProperties",
                description: "Inline styles to apply to the collapsible container.",
            },
            {
                name: "onTransitionEnd",
                type: "(event: TransitionEvent) => void",
                description: "Callback function fired when the transition animation ends.",
            },
        ],
    },
];
