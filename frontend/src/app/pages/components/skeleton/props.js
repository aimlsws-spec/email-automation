export const componentProps = [{
    componentName: "Skeleton",
    description: "A placeholder component for content loading, supporting animation for better visual feedback.",
    props: [
        {
            name: "animate",
            type: "boolean",
            default: true,
            description: "If true, applies a shimmering animation to indicate loading.",
        },
        {
            name: "className",
            type: "string",
            description: "Additional CSS class names to apply to the skeleton component for customization.",
        },
    ],
}
]
