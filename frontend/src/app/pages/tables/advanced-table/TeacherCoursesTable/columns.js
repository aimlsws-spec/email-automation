// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import {
    CourseNameCell,
    EarningCell,
    LevelCell,
    RatingCell,
    StatusCell,
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
        header: "Course",
        cell: CourseNameCell,
    }),
    columnHelper.accessor((row) => row.category, {
        id: "category",
        header: "Category",
    }),
    columnHelper.accessor((row) => row.level, {
        id: "level",
        header: "Level",
        cell: LevelCell,
    }),
    columnHelper.accessor((row) => row.rating, {
        id: "rating",
        header: "Rating",
        cell: RatingCell,
    }),
    columnHelper.accessor((row) => row.price, {
        id: "price",
        header: "Price",
    }),
    columnHelper.accessor((row) => row.earning, {
        id: "earning",
        header: "Earning",
        cell: EarningCell,
    }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        header: "Status",
        cell: StatusCell,
    }),

    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
]
