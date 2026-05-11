// Import Dependencies
import invariant from 'tiny-invariant';

// ----------------------------------------------------------------------

export function createRegistry() {
    const cards = new Map();
    const columns = new Map();

    function registerCard({ cardId, entry }) {
        cards.set(cardId, entry);

        return function cleanup() {
            cards.delete(cardId);
        };
    }

    function registerColumn({
        columnId,
        entry,
    }) {
        columns.set(columnId, entry);
        return function cleanup() {
            cards.delete(columnId);
        };
    }

    function getCard(cardId) {
        const entry = cards.get(cardId);
        invariant(entry);
        return entry;
    }

    function getColumn(columnId) {
        const entry = columns.get(columnId);
        invariant(entry);
        return entry;
    }

    return { registerCard, registerColumn, getCard, getColumn };
}
