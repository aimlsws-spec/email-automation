export const params = [
    {
        name: 'value',
        type: 'any',
        description: 'The controlled state value.'
    },
    {
        name: 'defaultValue',
        type: 'any',
        description: 'The initial value for the uncontrolled state.'
    },
    {
        name: 'finalValue',
        type: 'any',
        description: 'The fallback value for the uncontrolled state.'
    },
    {
        name: 'onChange',
        type: 'function',
        description: 'Handler function for changes to the controlled state.'
    }
];
