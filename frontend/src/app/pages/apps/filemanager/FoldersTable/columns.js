// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox"
import { RowActions } from "./RowActions";
import {
    LastEdit,
    Members,
    Name,
    Size,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.name, {
        id: "name",
        header: "Name",
        cell: Name,
    }),
    columnHelper.accessor((row) => row.updated_at, {
        id: "updated_at",
        header: "Last Edit",
        cell: LastEdit,
    }),
    columnHelper.accessor((row) => row.size, {
        id: "size",
        header: "size",
        cell: Size,
    }),
    columnHelper.accessor((row) => row.members, {
        id: "members",
        header: "Memebers",
        cell: Members,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions
    }),
]
