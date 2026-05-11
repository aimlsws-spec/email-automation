export const returns = [
    {
        name: "Provider",
        type: "React.FC<{ value: T, children: React.ReactNode }>",
        description: "The context Provider component. It accepts a 'value' to provide to the context and renders its children."
    },
    {
        name: "useSafeContext",
        type: "() => T",
        description: "A hook to access the context value. Throws an error if used outside of the Provider."
    }
];
