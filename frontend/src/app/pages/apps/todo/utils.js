export const todoKey = Symbol("todo");

export function getTodoData({ todo, index, instanceId }) {
    return {
        [todoKey]: true,
        todo,
        index,
        instanceId,
    };
}

export function getItemRegistry() {
    const registry = new Map();

    function register({ itemId, element }) {
        registry.set(itemId, element);

        return function unregister() {
            registry.delete(itemId);
        };
    }

    function getElement(itemId) {
        return registry.get(itemId) ?? null;
    }

    return { register, getElement };
}

export function isItemData(data, itemKey) {
    return data[itemKey] === true;
}

export function getItemPosition({ index, items }) {
    if (items.length === 1) {
        return 'only';
    }

    if (index === 0) {
        return 'first';
    }

    if (index === items.length - 1) {
        return 'last';
    }

    return 'middle';
}
