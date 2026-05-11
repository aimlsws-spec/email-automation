// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    AssignCell,
    CourseNameCell,
    FileNameCell,
    PermissionCell,
    SizeCell,
} from "./rows";
import { RowActions } from "./RowActions";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.name, {
        id: "course_name",
        header: "Course Name",
        cell: CourseNameCell,
    }),
    columnHelper.accessor((row) => row.file_name, {
        id: "file_name",
        header: "File Name",
        cell: FileNameCell,
    }),
    columnHelper.accessor((row) => row.permission.title, {
        id: "permission",
        header: "Permission",
        cell: PermissionCell,
    }),
    columnHelper.accessor((row) => row.assign_count, {
        id: "assign",
        header: "Assign",
        cell: AssignCell,
    }),
    columnHelper.accessor((row) => row.file_size, {
        id: "file_size",
        header: "Size",
        cell: SizeCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions
    }),
]
