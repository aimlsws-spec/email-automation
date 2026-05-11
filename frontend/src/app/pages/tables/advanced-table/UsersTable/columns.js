// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { CopyableCell } from "components/shared/table/CopyableCell";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { AvatarCell, NameCell, RoleCell, StatusCell } from "./rows";
import { RowActions } from "./RowActions";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.display({
        id: "avatar",
        header: "Avatar",
        cell: AvatarCell,
    }),
    columnHelper.accessor((row) => row.name, {
        id: "name",
        header: "name",
        cell: NameCell,
    }),
    columnHelper.accessor((row) => row.role, {
        id: "role",
        header: "role",
        cell: RoleCell,
    }),
    columnHelper.accessor((row) => row.age, {
        id: "age",
        header: "age",
    }),
    columnHelper.accessor((row) => row.phone, {
        id: "phone",
        header: "phone",
        cell: CopyableCell,
    }),
    columnHelper.accessor((row) => row.email, {
        id: "email",
        header: "email",
        cell: CopyableCell,
    }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        header: "status",
        cell: StatusCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
]
