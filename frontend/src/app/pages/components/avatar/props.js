export const componentProps = [
    {
        componentName: "Avatar",
        desc: "Renders an avatar image or a placeholder when no image is provided.",
        props: [
            {
                name: "component",
                default: "div",
                type: "string | React.ElementType",
                description:
                    "Custom component or HTML element to render the root wrapper.",
            },
            {
                name: "imgComponent",
                default: "img",
                type: "string | React.ElementType",
                description: "Custom component or HTML element to render the image.",
            },
            {
                name: "alt",
                type: "string",
                description:
                    "Alternative text for the image, useful for accessibility and SEO.",
            },
            {
                name: "loading",
                default: "lazy",
                type: '"lazy" | "eager"',
                description: "Determines the loading behavior of the image.",
            },
            {
                name: "imgProps",
                type: "object",
                description: "Additional props to pass to the image component.",
            },
            {
                name: "src",
                type: "string",
                description: "The source URL of the image.",
            },
            {
                name: "srcSet",
                type: "string",
                description:
                    "Specifies multiple image sources for different screen resolutions or sizes.",
            },
            {
                name: "name",
                type: "string",
                description: "The name or label to display when no image is provided.",
            },
            {
                name: "initialColor",
                default: "neutral",
                type: "string",
                description:
                    "The initial color for the avatar when no image is provided.",
            },
            {
                name: "initialVariant",
                default: "filled",
                type: '"filled" | "soft"',
                description:
                    "The initial style variant of the avatar when no image is provided.",
            },
            {
                name: "initialProps",
                type: "object",
                description: "Additional props for the initial node when no image is provided.",
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
                name: "children",
                type: "React.ReactNode",
                description:
                    "The content to be rendered when neither a name nor an image is provided.",
            },
            {
                name: "size",
                default: 12,
                type: "number",
                description: "Specifies the size of the avatar.",
            },
            {
                name: "style",
                type: "React.CSSProperties",
                description: "Inline styles to apply to the root element.",
            },
            {
                name: "indicator",
                type: "React.ReactNode",
                description:
                    "An optional indicator, such as a badge or status marker, to display alongside the avatar.",
            },
        ],
    },
    {
        componentName: "AvatarDot",
        desc: "Renders a status dot for the avatar.",
        props: [
            {
                name: "color",
                default: "neutral",
                type: "string",
                description: "Specifies the color of the dot.",
            },
            {
                name: "isPing",
                default: false,
                type: "boolean",
                description: "Whether to apply a ping animation to the dot.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the dot.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "Content to render inside the dot.",
            },
        ],
    },
];
