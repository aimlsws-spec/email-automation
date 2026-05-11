import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { useState } from 'react';
import { useEventCallback } from 'hooks';

// Component rendering a large list of items
function ItemList({ items }) {
    const [selectedItem, setSelectedItem] = useState(null);

    // Stable callback using 'useEventCallback'
    const handleItemClick = useEventCallback((item) => {
        console.log('Item clicked:', item);
        setSelectedItem(item);
    });

    return (
        <ul>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    item={item}
                    onClick={handleItemClick}
                />
            ))}
        </ul>
    );
}

// Individual list item component
const ListItem = React.memo(({ item, onClick }) => {
    console.log('Rendering item:', item.id);
    return (
        <li onClick={() => onClick(item)}>
            {item.name}
        </li>
    );
});

export default function App() {
    const items = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: i + 1,
    }));

    return <ItemList items={items} />;
}
`}</SyntaxHighlighter>
    </div>
  );
}
