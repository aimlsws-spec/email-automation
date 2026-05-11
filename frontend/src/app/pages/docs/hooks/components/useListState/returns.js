export const returns = [
    {
        name: "state",
        type: "Array",
        description: "The current state of the list.",
    },
    {
        name: "handlers",
        type: "Object",
        description: "An object containing various methods to manipulate the list state.",
    },
    {
        name: "handlers.setState",
        type: "function",
        description: "Updates the entire list state with a new array.",
    },
    {
        name: "handlers.append",
        type: "function",
        description: "Appends one or more items to the end of the list.",
    },
    {
        name: "handlers.prepend",
        type: "function",
        description: "Prepends one or more items to the beginning of the list.",
    },
    {
        name: "handlers.insert",
        type: "function",
        description: "Inserts one or more items at a specified index in the list.",
    },
    {
        name: "handlers.pop",
        type: "function",
        description: "Removes and returns the last item from the list.",
    },
    {
        name: "handlers.shift",
        type: "function",
        description: "Removes and returns the first item from the list.",
    },
    {
        name: "handlers.apply",
        type: "function",
        description: "Applies a function to each item in the list and returns a new list.",
    },
    {
        name: "handlers.applyWhere",
        type: "function",
        description: "Applies a function to items that satisfy a condition and returns a new list.",
    },
    {
        name: "handlers.remove",
        type: "function",
        description: "Removes items from the list based on a condition.",
    },
    {
        name: "handlers.removeWhere",
        type: "function",
        description: "Removes items from the list based on a condition.",
    },
    {
        name: "handlers.reorder",
        type: "function",
        description: "Reorders items in the list based on a condition.",
    },
    {
        name: "handlers.setItem",
        type: "function",
        description: "Updates an item at a specified index in the list.",
    },
    {
        name: "handlers.setItemProp",
        type: "function",
        description: "Updates a property of an item at a specified index in the list.",
    },
    {
        name: "handlers.setItemPropWhere",
        type: "function",
        description: "Updates a property of items that satisfy a condition in the list.",
    },
    {
        name: "handlers.filter",
        type: "function",
        description: "Filters the list based on a condition and returns a new list.",
    },

]