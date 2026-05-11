export const componentProps = [
    {
        componentName: "AnimatedTick",
        desc: "A visually engaging tick mark with animation effects.",
        props: [
            {
                name: "animate",
                default: "true",
                type: "boolean",
                description: "Determines whether the animation is enabled.",
            },
            {
                name: "strokeWidth",
                default: "10",
                type: "number",
                description: "Specifies the thickness of the tick's stroke.",
            },
            {
                name: "className",
                type: "string",
                description: "CSS class to be applied to the SVG element.",
            },
        ],
    },
];
