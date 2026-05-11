import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic(){
    return <SyntaxHighlighter language="jsx">{`import { useListState } from "hooks";

export function Demo() {
  const [values, handlers] = useListState([{ a: 1 }]);

  // add one or more items to the end of the list
  const append = () => handlers.append({ a: 2 });
  // values -> [{ a: 1 }, { a: 2 }]

  // add one or more items to the start of the list
  const prepend = () => handlers.prepend({ a: 3 }, { a: 4 });
  // values -> [{ a: 3 }, { a: 4 }, { a: 1 }, { a: 2 }]

  // remove items at given positions
  const remove = () => handlers.remove(0, 2);
  // values -> [{ a: 4 }, { a: 2 }]

  // insert one or more items at given position
  const insert = () => handlers.insert(1, { a: 5 });
  // values -> [{ a: 4 }, { a: 5 }, { a: 2 }]

  // apply function to each element of the list
  const apply = () => handlers.apply((item, index) => ({ a: item.a * index }));
  // values -> [{ a: 0 }, { a: 5 }, { a: 4 }]

  // move item from one position to another
  const reorder = () => handlers.reorder({ from: 2, to: 0 });
  // values -> [{ a: 4 }, { a: 0 }, { a: 5 }]

  // swap items positions
  const swap = () => handlers.swap({ from: 0, to: 2 });
  // values -> [{ a: 5 }, { a: 0 }, { a: 4 }]

  // apply function to each element that matches condition
  const applyWhere = () =>
    handlers.applyWhere(
      (item) => item.a > 0,
      (item) => ({ a: item.a + 2 }),
    );
  // values -> [{ a: 7 }, { a: 0 }, { a: 6 }]

  // set entirely new state
  const setState = () => handlers.setState([{ a: 6 }, { a: 7 }]);
  // values -> [{ a: 6 }, { a: 7 }]

  // set individual item at given position
  const setItem = () => handlers.setItem(0, { a: 8 });
  // values -> [{ a: 8 }, { a: 7 }]

  // set item property at given position
  const setItemProp = () => handlers.setItemProp(1, "a", "new-prop");
  // values -> [{ a: 8 }, { a: 'new-prop' }]

  // filter objects that have a = 'new-prop'
  const filter = () => handlers.filter((item) => item.a === "new-prop");
  // values -> [{ a: 'new-prop' }]
}
`}</SyntaxHighlighter>
}