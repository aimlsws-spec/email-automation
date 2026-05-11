// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { CopyableCell } from "components/shared/table/CopyableCell";
import { NameCell, RoleCell, StatusCell } from "./rows";
import { RowActions } from "./RowActions";
import { HighlightableCell } from "components/shared/table/HighlightableCell";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Stat",
    label: "Status",
    cell: StatusCell,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: "name",
    label: "Name",
    cell: NameCell,
  }),
  columnHelper.accessor((row) => row.role, {
    id: "role",
    header: "role",
    label: "Role",
    cell: RoleCell,
    filterFn: "equalsString",
  }),
  columnHelper.accessor((row) => row.age, {
    id: "age",
    header: "age",
    label: "Age",
    cell: HighlightableCell,
  }),
  columnHelper.accessor((row) => row.phone, {
    id: "phone",
    header: "phone",
    label: "Phone",
    cell: (props) => <CopyableCell {...props} highlight />,
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: "email",
    label: "Email",
    cell: (props) => <CopyableCell {...props} highlight />,
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    label: "Row Actions",
    cell: RowActions,
  }),
];
