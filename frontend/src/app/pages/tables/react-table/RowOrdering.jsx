// Import Dependencies
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useDeferredValue, useMemo, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { RxDragHandleDots2 } from "react-icons/rx";

// Local Imports
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { Button, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { getMultipleRandom } from "utils/getMultipleRandom";
import { fakeData } from "./fakeData";
import { StrictModeDroppable } from "components/shared/StrictModeDroppable";

// ----------------------------------------------------------------------

const users = getMultipleRandom(fakeData, 10);

const defaultColumns = [
  {
    accessorKey: "id",
    id: "id",
    header: "",
  },
  {
    accessorKey: "firstName",
    id: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    id: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
  },
  {
    accessorKey: "state",
    id: "state",
    header: "State",
  },
  {
    accessorKey: "address",
    id: "address",
    header: "Address",
  },
];

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function RowOrdering() {
  const [data, setData] = useState([...users]);
  const columns = useMemo(() => [...defaultColumns], []);

  const [globalFilter, setGlobalFilter] = useState("");
  const deferredGlobalFilter = useDeferredValue(globalFilter);

  const reorderRow = (draggedRowIndex, targetRowIndex) => {
    data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0]);
    setData([...data]);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderRow(source.index, destination.index);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: deferredGlobalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Row Ordering
        </h2>
        <div className="flex">
          <CollapsibleSearch
            placeholder="Search here..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <Button
            onClick={() => setData([...users])}
            variant="flat"
            isIcon
            className="size-8 rounded-full"
          >
            <ArrowPathIcon className="size-4.5" />
          </Button>
        </div>
      </div>
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

            <DragDropContext onDragEnd={handleDragEnd}>
              <StrictModeDroppable droppableId="table-body">
                {(provided) => (
                  <TBody ref={provided.innerRef} {...provided.droppableProps}>
                    {table.getRowModel().rows.map((row) => (
                      <Draggable
                        draggableId={row.id}
                        key={row.id}
                        index={row.index}
                      >
                        {(provided) => (
                          <Tr
                            className={clsx(
                              "border-y border-transparent border-b-gray-200 last:border-none dark:border-b-dark-500",
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            {row.getVisibleCells().map((cell) => {
                              const cellValue = flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              );
                              return cell.column.id === "id" ? (
                                <Td key={cell.id}>
                                  <div className="flex items-center justify-between">
                                    <Button
                                      {...provided.dragHandleProps}
                                      className="size-5"
                                      variant="flat"
                                      isIcon
                                    >
                                      <RxDragHandleDots2 className="size-4" />
                                    </Button>
                                  </div>
                                </Td>
                              ) : (
                                <Td key={cell.id}>{cellValue}</Td>
                              );
                            })}
                          </Tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TBody>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </Table>
        </div>
      </Card>
    </div>
  );
}
