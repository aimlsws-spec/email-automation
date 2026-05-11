// Import Dependencies
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useMemo, useRef } from "react";
import PropTypes from "prop-types";

// Local Imports
import clsx from "clsx";
import {
  Button,
  Card,
  Collapse,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
} from "components/ui";
import { useBoxSize } from "hooks";
import { subComponent as users } from "./fakeData";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

const defaultColumns = [
  columnHelper.display({
    id: "expand",
    header: "More",
    cell: ({ row }) => (
      <>
        {row.getCanExpand() ? (
          <Button
            isIcon
            className="size-6"
            variant="flat"
            onClick={row.getToggleExpandedHandler()}
          >
            <ChevronUpIcon
              className={clsx(
                "size-4.5 transition-transform",
                row.getIsExpanded() && "rotate-180",
              )}
            />
          </Button>
        ) : null}
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

export function SubComponent() {
  const data = useMemo(() => [...users], []);
  const columns = useMemo(() => [...defaultColumns], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const cardRef = useRef();
  const { width: cardWidth } = useBoxSize({ ref: cardRef });

  return (
    <div>
      <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Subcomponent Table
      </h2>
      <Card className="mt-3" ref={cardRef}>
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
              {table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <Tr
                      key={row.id}
                      className={clsx(
                        "border-y border-transparent border-b-gray-200 last:border-none dark:border-b-dark-500",
                        row.getIsExpanded() && "border-dashed",
                      )}
                    >
                      {/* first row is a normal row */}
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
                    <>
                      <tr hidden />
                      <tr>
                        {/* 2nd row is a custom 1 cell row */}
                        <td
                          colSpan={row.getVisibleCells().length}
                          className="p-0"
                        >
                          <Collapse in={row.getIsExpanded()}>
                            <RenderSubComponent
                              row={row}
                              cardWidth={cardWidth}
                            />
                          </Collapse>
                        </td>
                      </tr>
                    </>
                  </Fragment>
                );
              })}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function RenderSubComponent({ row, cardWidth }) {
  const cols = ["#", "Name", "Job", "FAVORITE COLOR"];

  return (
    <div
      className="sticky border-b border-b-gray-200 pb-4 pt-3 dark:border-b-dark-500 ltr:left-0 rtl:right-0"
      style={{ maxWidth: cardWidth }}
    >
      <div className="min-w-full overflow-x-auto px-4 sm:px-5">
        <Table hoverable className="w-full text-left rtl:text-right">
          <THead>
            <Tr>
              {cols.map((title, index) => (
                <Th
                  key={index}
                  className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-l-lg last:ltr:rounded-r-lg first:rtl:rounded-r-lg last:rtl:rounded-l-lg"
                >
                  {title}
                </Th>
              ))}
            </Tr>
          </THead>
          <TBody>
            {row.original.subComponentData.map((tr) => (
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

      <div className="px-4 pt-2 text-end sm:px-5">
        <button
          onClick={() => row.toggleExpanded(false)}
          className="cursor-pointer border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          Close
        </button>
      </div>
    </div>
  );
}

RenderSubComponent.propTypes = {
  row: PropTypes.object,
  cardWidth: PropTypes.number,
};
