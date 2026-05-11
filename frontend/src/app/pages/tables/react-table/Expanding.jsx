// Import Dependencies
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { TbSquareRoundedMinus, TbSquareRoundedPlus } from "react-icons/tb";

// Local Imports
import { Button, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { subRowData as users } from "./fakeData";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

const defaultColumns = [
  columnHelper.display({
    id: "expand",
    header: ({ table }) => (
      <Button
        isIcon
        className="size-6"
        variant="flat"
        onClick={table.getToggleAllRowsExpandedHandler()}
      >
        {table.getIsAllRowsExpanded() ? (
          <TbSquareRoundedMinus className="size-4.5" />
        ) : (
          <TbSquareRoundedPlus className="size-4.5" />
        )}
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <>
        {row.getCanExpand() ? (
          <Button
            isIcon
            className="size-6"
            variant="flat"
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? (
              <MinusCircleIcon className="size-4.5" />
            ) : (
              <PlusCircleIcon className="size-4.5" />
            )}
          </Button>
        ) : null}
        {getValue()}
      </>
    ),
  }),
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

export function Expanding() {
  const data = useMemo(() => [...users], []);
  const columns = useMemo(() => [...defaultColumns], []);

  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
  });

  return (
    <div>
      <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Expanding Table
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
