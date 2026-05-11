export const componentProps = [
    {
        componentName: "Upload",
        description: "A versatile file upload component that supports multiple files, custom input properties, and accessibility features.",
        props: [
            {
                name: "onChange",
                type: "(event: React.ChangeEvent<HTMLInputElement>) => void",
                description: "Callback function triggered when a file is selected or changed.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "Custom content or elements to render inside the upload component, such as a button or label.",
            },
            {
                name: "multiple",
                type: "boolean",
                description: "If true, allows multiple file selection.",
            },
            {
                name: "accept",
                type: "string",
                description: "Specifies the file types that the input accepts (e.g., '.jpg, .png, .pdf').",
            },
            {
                name: "name",
                type: "string",
                description: "Specifies the name attribute of the input element, useful for forms.",
            },
            {
                name: "form",
                type: "string",
                description: "Specifies the form ID that the input is associated with.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the upload component, preventing file selection.",
            },
            {
                name: "capture",
                type: "string | boolean",
                description: "If set, determines the input device for file capture (e.g., 'camera').",
            },
            {
                name: "inputProps",
                type: "object",
                description: "Additional props to apply to the underlying `<input>` element.",
            },
        ],
    }
]
