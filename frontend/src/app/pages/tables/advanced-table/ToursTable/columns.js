// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import {
    DepartureCell,
    DestinationCell,
    LengthCell,
    PriceCell,
    ReturnCell,
    TouristGroupCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => `${row.destination} ${row.country}`, {
        id: "destination",
        header: "destination",
        cell: DestinationCell,
    }),
    columnHelper.accessor((row) => row.duration, {
        id: "duration",
        header: "Length",
        cell: LengthCell,
    }),
    columnHelper.accessor((row) => row.start_date, {
        id: "start_date",
        header: "Depature",
        cell: DepartureCell,
    }),
    columnHelper.accessor((row) => row.end_date, {
        id: "end_date",
        header: "Return",
        cell: ReturnCell,
    }),
    columnHelper.accessor((row) => row.adults + row.childs, {
        id: "tourist_group",
        header: "Tourist group",
        cell: TouristGroupCell,
    }),
    columnHelper.accessor((row) => row.price, {
        id: "price",
        header: "Price",
        cell: PriceCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
]
