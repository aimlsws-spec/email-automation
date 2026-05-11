// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    AddressCell,
    CustomerCell,
    DateCell,
    OrderIdCell,
    OrderStatusCell,
    ProfitCell,
    TotalCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Row Selection",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.order_id, {
        id: "order_id",
        label: "Order ID",
        header: "Order",
        cell: OrderIdCell,
    }),
    columnHelper.accessor((row) => Number(row.created_at), {
        id: "created_at",
        label: "Order Date",
        header: "Date",
        cell: DateCell,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.customer.name, {
        id: "customer",
        label: "Customer",
        header: "Customer",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.total, {
        id: "total",
        label: "Total",
        header: "Total",
        cell: TotalCell,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.profit, {
        id: "profit",
        label: "Profit",
        header: "Profit",
        cell: ProfitCell,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.order_status, {
        id: "order_status",
        label: "Order Status",
        header: "Order Status",
        cell: OrderStatusCell,
        filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor(
        (row) =>
            `${row.shipping_address?.street}, ${row.shipping_address?.line}`,
        {
            id: "address",
            label: "Address",
            header: "Address",
            cell: AddressCell,
        }
    ),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions
    }),
]
