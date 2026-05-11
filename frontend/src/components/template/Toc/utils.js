function getHeadingsData(headings) {
    const result = [];

    for (let i = 0; i < headings.length; i += 1) {
        const heading = headings[i];

        if (heading.id) {
            result.push({
                depth: parseInt(heading.getAttribute('data-order'), 10),
                content: heading.getAttribute('data-heading') || '',
                id: heading.id,
                getNode: () => document.getElementById(heading.id),
            });
        }
    }

    return result;
}

export function getHeadings(selector) {
    const root = document.querySelector(selector);

    if (!root) {
        return [];
    }

    return getHeadingsData(Array.from(root.querySelectorAll('[data-heading]')));
}
