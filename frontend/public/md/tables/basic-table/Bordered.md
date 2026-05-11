```jsx
// Local Imports
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

// ----------------------------------------------------------------------

const cols = ["#", "Name", "Job", "FAVORITE COLOR"];

const data = [
  {
    uid: "1",
    name: "Cy Ganderton",
    job: "Quality Control Specialist",
    favColor: "Blue",
  },
  {
    uid: "2",
    name: "Hart Hagerty",
    job: "Desktop Support Technician",
    favColor: "Purple",
  },
  {
    uid: "3",
    name: "Brice Swyre",
    job: "Tax Accountant",
    favColor: "Red",
  },
  {
    uid: "4",
    name: "Marjy Ferencz",
    job: "Office Assistant I",
    favColor: "Crimson",
  },
];

export function Bordered() {
  return (
    <div className="hide-scrollbar min-w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-500">
      <Table className="w-full text-left rtl:text-right">
        <THead>
          <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
            {cols.map((title, index) => (
              <Th
                key={index}
                className="font-semibold uppercase text-gray-800 dark:text-dark-100"
              >
                {title}
              </Th>
            ))}
          </Tr>
        </THead>
        <TBody>
          {data.map((tr) => (
            <Tr
              key={tr.uid}
              className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
            >
              <Td>{tr.uid}</Td>
              <Td>{tr.name}</Td>
              <Td>{tr.job}</Td>
              <Td>{tr.favColor}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
```