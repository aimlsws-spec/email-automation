export const componentProps = [
    {
        componentName: "TextEditor",
        description: "A rich text editor component powered by Quill, allowing advanced text formatting and customization.",
        props: [
            {
                name: "readOnly",
                type: "boolean",
                description: "If true, the editor is in read-only mode, preventing text changes.",
            },
            {
                name: "value",
                type: "Delta",
                description: "The current value of the editor. Use this for controlled components.",
            },
            {
                name: "defaultValue",
                type: "Delta",
                description: "The default value of the editor when the component is first rendered.",
            },
            {
                name: "onTextChange",
                type: "(delta: Delta, delta: Delta) => void",
                description: "Callback triggered whenever the text content changes. It provides the updated content and delta.",
            },
            {
                name: "onSelectionChange",
                type: "(range: Range, oldRange: Range, source: string) => void",
                description: "Callback triggered when the selection changes in the editor. It provides the range of selected text.",
            },
            {
                name: "onChange",
                type: "(content: string, delta: Delta, source: string) => void",
                description: "General change handler that fires whenever the editor content changes, similar to `onTextChange`.",
            },
            {
                name: "placeholder",
                type: "string",
                description: "Placeholder text that appears when the editor is empty.",
            },
            {
                name: "modules",
                type: "object",
                description: "Custom modules to configure the Quill editor's toolbar, formats, or other behavior.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element of the editor.",
            },
            {
                name: "error",
                type: "string",
                description: "Error message to display when the editor encounters an error (optional).",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object to define specific CSS class names for the different parts of the component (e.g., editor, toolbar).",
            },
            {
                name: "label",
                type: "string",
                description: "Label to display above the editor, usually for form elements.",
            },
        ],
    }

]
