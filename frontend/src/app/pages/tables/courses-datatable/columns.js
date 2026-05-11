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
    PriceCell,
    RatingCell,
    StatusCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: 'Row Selection',
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.name, {
        id: "name",
        header: "Course",
        label: 'Course',
        cell: CourseNameCell,
    }),
    columnHelper.accessor((row) => row.category, {
        id: "category",
        header: "Category",
        label: 'Category',
    }),
    columnHelper.accessor((row) => row.level, {
        id: "level",
        header: "Level",
        label: 'Level',
        cell: LevelCell,
        filter: "searchableSelect",
        filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor((row) => row.rating, {
        id: "rating",
        header: "Rating",
        label: 'Rating',
        cell: RatingCell,
        filterFn: "inNumberRange",
        filter: "numberRange",
    }),
    columnHelper.accessor((row) => row.price, {
        id: "price",
        header: "Price",
        label: 'Price',
        cell: PriceCell,
        filterFn: "inNumberRange",
        filter: "numberRange",
    }),
    columnHelper.accessor((row) => row.earning, {
        id: "earning",
        header: "Earning",
        label: 'Earning',
        cell: EarningCell,
        filterFn: "inNumberRange",
        filter: "numberRange",
    }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        header: "Status",
        label: 'Status',
        cell: StatusCell,
        filter: "searchableSelect",
        filterFn: "arrIncludesSome",
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        label: 'Row Actions',
        cell: RowActions,
    }),
    columnHelper.accessor((row) => row.lesson_count, {
        id: "lesson_count",
        isHiddenColumn: true,
        filterFn: "inNumberRange",
        filter: "numberRange",
    }),
    columnHelper.accessor((row) => row.students, {
        id: "students",
        isHiddenColumn: true,
        filterFn: "inNumberRange",
        filter: "numberRange",
    }),
    columnHelper.accessor((row) => row.duration, {
        id: "duration",
        isHiddenColumn: true,
        filterFn: "inNumberRange",
        filter: "numberRange",
    }),
]
