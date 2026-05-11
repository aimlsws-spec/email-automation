// Import Dependencies
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

// Local Imports
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { getMultipleRandom } from "utils/getMultipleRandom";
import { fakeData } from "./fakeData";

const users = getMultipleRandom(fakeData, 10);

// ----------------------------------------------------------------------

const defaultColumns = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "firstName",
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    id: "lastName",
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "state",
    accessorKey: "state",
    header: "State",
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
  },
];

export function Basic() {
  const data = useMemo(() => [...users], []);
  const columns = useMemo(() => [...defaultColumns], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Basic Table
      </h2>
      <Card className="mt-3">
        <div className="min-w-full overflow-x-auto">
          <Table className="w-full text-left rtl:text-right">
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => (
                <Tr
                  key={row.id}
                  className="border-y border-transparent border-b-gray-200 last:border-none dark:border-b-dark-500"
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
