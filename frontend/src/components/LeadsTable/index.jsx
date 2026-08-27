// Local Imports
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

// Import Dependencies
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useDidUpdate } from "hooks";
import { MenuAction } from "./MenuActions";
import { columns } from "./columns";
import { PaginationSection } from "./PaginationSection";
import { fetchLeads, getJSON } from "services/api";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";

export function LeadsTable({ campaignId = null }) {
  const [products, setProducts] = useState([]);

  // Controlled pagination state — keeps page across data refreshes
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Ref so the polling callback always reads the latest page without being a dependency
  const paginationRef = useRef(pagination);
  paginationRef.current = pagination;

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    meta: {
      deleteRow: (row) => {
        setProducts((old) => old.filter((oldRow) => oldRow.id !== row.original.id));
      },
    },
    getCoreRowModel: getCoreRowModel(),

    onGlobalFilterChange: (value) => {
      // Reset to page 1 only when search text changes
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      setGlobalFilter(value);
    },
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    // Disable automatic page reset — we manage it via controlled state
    autoResetPageIndex: false,

    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        console.log(
          `[PAGINATION] Current Page: ${next.pageIndex + 1} | Page Size: ${next.pageSize}`
        );
        return next;
      });
    },
  });

  const load = useCallback(async () => {
    const { pageIndex, pageSize } = paginationRef.current;
    console.log(
      `[PAGINATION] Auto Refresh: Triggered | Current Page: ${pageIndex + 1} | Page Size: ${pageSize}`
    );
    try {
      let leads;
      if (campaignId) {
        const json = await getJSON(`/api/campaigns/${campaignId}/leads`);
        leads = json?.data ?? (Array.isArray(json) ? json : []);
      } else {
        const d = await fetchLeads(null);
        leads = Array.isArray(d) ? d : [];
      }
      console.log(`[API] Returned Records: ${leads.length}`);
      setProducts(leads);
      // Preserve current page — pagination state is controlled so it won't reset
      console.log(`[TABLE] After Refresh: Page ${paginationRef.current.pageIndex + 1}`);
    } catch {
      setProducts([]);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 5000);
    return () => clearInterval(intervalId);
  }, [load]);

  useDidUpdate(() => table.resetRowSelection(), [products]);

  return (
    <div className="flex flex-col">
      <div className="table-toolbar flex items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          {campaignId ? "Campaign Leads" : "All Leads"}
        </h2>
        <div className="flex">
          <CollapsibleSearch
            placeholder="Search here..."
            value={globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
          <MenuAction />
        </div>
      </div>
      <Card className="relative mt-3 flex grow flex-col">
        <div className="table-wrapper min-w-full grow overflow-x-auto">
          <Table hoverable className="w-full text-left rtl:text-right">
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg"
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
                    className={clsx(
                      "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                      row.getIsSelected() &&
                        !isSafari &&
                        "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                    )}
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
              {table.getCoreRowModel().rows.length === 0 && (
                <Tr>
                  <Td colSpan={table.getAllColumns().length} className="px-4 py-12 text-center text-gray-400 font-medium italic">
                    {campaignId ? "No leads in this campaign" : "No leads found"}
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>
        {table.getCoreRowModel().rows.length > 0 && (
          <div className="p-4 sm:p-5">
            <PaginationSection table={table} />
          </div>
        )}
      </Card>
    </div>
  );
}
