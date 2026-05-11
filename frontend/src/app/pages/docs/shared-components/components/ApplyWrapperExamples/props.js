export const componentProps = [
    {
        componentName: "ApplyWrapper",
        desc: "Conditionally wraps an element with a specified wrapper component.",
        props: [
            {
                name: "when",
                type: "boolean",
                description: "Indicates whether the wrapper should be applied.",
            },
            {
                name: "wrapper",
                type: "function",
                description: "A function that returns the wrapper node, with children passed as a prop.",
            },
        ],
    },
];
