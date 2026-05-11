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

export function Dense() {
  return (
    <div className="hide-scrollbar min-w-full overflow-x-auto">
      <Table dense className="w-full text-left rtl:text-right">
        <THead>
          <Tr>
            {cols.map((title, index) => (
              <Th
                key={index}
                className="bg-gray-200 font-semibold uppercase text-gray-800 ltr:first:rounded-l-lg ltr:last:rounded-r-lg rtl:first:rounded-r-lg rtl:last:rounded-l-lg dark:bg-dark-800 dark:text-dark-100"
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
              <Td className="ltr:rounded-l-lg rtl:rounded-r-lg">{tr.uid}</Td>
              <Td>{tr.name}</Td>
              <Td>{tr.job}</Td>
              <Td className="ltr:rounded-r-lg rtl:rounded-l-lg">
                {tr.favColor}
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
```