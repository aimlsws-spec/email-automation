export const componentProps = [
    {
        componentName: "Page",
        desc: "A wrapper component used to structure the content of a page, including the title and main content.",
        props: [
            {
                name: "title",
                type: "string",
                description: "The title to be displayed on the browser tab for the document.",
            },
            {
                name: "component",
                default: 'Fragment',
                type: "React.ElementType",
                description: "The React component or element to be rendered as the main content of the page.",
            },
        ],
    },
];
