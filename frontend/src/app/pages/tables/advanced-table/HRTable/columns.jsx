// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import { CopyableCell } from "components/shared/table/CopyableCell";

// Local Imports
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
  DepartmentCell,
  IdCell,
  NameCell,
  PositionCell,
  StatusCell,
} from "./rows";
import { RowActions } from "./RowActions";
import { HighlightableCell } from "components/shared/table/HighlightableCell";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.user_id, {
    id: "user_id",
    header: () => <span className="-mx-2">ID</span>,
    cell: IdCell,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: "Name",
    cell: NameCell,
  }),
  columnHelper.accessor((row) => row.position, {
    id: "position",
    header: "Position",
    cell: PositionCell,
  }),
  columnHelper.accessor((row) => row.level, {
    id: "level",
    header: "Level",
    cell: HighlightableCell,
  }),
  columnHelper.accessor((row) => row.status.title, {
    id: "status",
    header: "Status",
    cell: StatusCell,
  }),
  columnHelper.accessor((row) => row.department, {
    id: "department",
    header: "Department",
    cell: DepartmentCell,
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: "Email",
    cell: (props) => <CopyableCell {...props} highlight />,
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: RowActions,
  }),
];
