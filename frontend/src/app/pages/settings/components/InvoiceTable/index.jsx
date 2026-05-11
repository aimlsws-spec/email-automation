// Local Imports
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

// Import Dependencies
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import {
  Box,
  Pagination,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
  PaginationPrevious,
  PaginationItems,
  PaginationNext,
} from "components/ui";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { columns } from "./columns";
import { invoiceList } from "./invoiceList";
import { Toolbar } from "./Toolbar";

// ----------------------------------------------------------------------

export function InvoiceTable() {
  const [invoices] = useState([...invoiceList]);
  const { isXl, is2xl } = useBreakpointsContext();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: invoices,
    columns,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      globalFilter,
      sorting,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,

    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

  const paginationState = table.getState().pagination;

  return (
    <div>
      <Toolbar table={table} />
      <Box className="relative -mx-4 mt-3 sm:-mx-5">
        <div className="table-wrapper min-w-full overflow-x-auto">
          <Table hoverable className="w-full text-left rtl:text-right">
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100"
                    >
                      {header.column.getCanSort() ? (
                        <div
                          className="flex cursor-pointer select-none items-center space-x-3 "
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="flex-1">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </span>
                          <TableSortIcon sorted={header.column.getIsSorted()} />
                        </div>
                      ) : header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Tr
                    key={row.id}
                    className="relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </div>
        {table.getCoreRowModel().rows.length && (
          <div className="px-4 pb-2 pt-6 sm:px-5">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
              <div>
                <Pagination
                  total={table.getPageCount()}
                  value={paginationState.pageIndex + 1}
                  onChange={(page) => table.setPageIndex(page - 1)}
                  siblings={isXl ? 2 : is2xl ? 3 : 1}
                  boundaries={isXl ? 2 : 1}
                >
                  <PaginationPrevious />
                  <PaginationItems />
                  <PaginationNext />
                </Pagination>
              </div>
              <div className="truncate text-xs-plus">
                {paginationState.pageIndex * paginationState.pageSize + 1} -{" "}
                {table.getRowModel().rows.length} of{" "}
                {table.getCoreRowModel().rows.length} entries
              </div>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
}
