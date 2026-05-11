export const componentProps = [
    {
        componentName: "PreviewImage",
        desc: "A component that displays an image preview. If no file is provided, it falls back to displaying an image from a specified source URL.",
        props: [
            {
                name: "file",
                type: "File",
                description: "The file object representing the image to be displayed.",
            },
            {
                name: "src",
                type: "string",
                description: "The URL of the image to be displayed when a file is not provided.",
            },
            {
                name: "alt",
                type: "string",
                description: "Alternative text for the image, used for accessibility and when the image fails to load.",
            }
        ],
    },
];
