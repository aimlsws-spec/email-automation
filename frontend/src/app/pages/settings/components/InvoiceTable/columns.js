// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    Amount,
    Date,
    Download,
    InvoiceName,
    Status
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.accessor((row) => row.invoice_name, {
        id: "invoice_name",
        header: "Invoice Name",
        cell: InvoiceName,
    }),
    columnHelper.accessor((row) => row.id, {
        id: "id",
        header: "#",
    }),
    columnHelper.accessor((row) => row.invoice_date, {
        id: "invoice_date",
        header: "invoice date",
        filterFn: "inNumberRange",
        cell: Date
    }),
    columnHelper.accessor((row) => row.due_date, {
        id: "due_date",
        header: "due date",
        cell: Date
    }),
    columnHelper.accessor((row) => row.amount, {
        id: "amount",
        header: "amount",
        cell: Amount,
        filterFn: 'inNumberRange'
    }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        filterFn: 'arrIncludesSome',
        header: "status",
        cell: Status
    }),
    columnHelper.display({
        id: 'download',
        header: "Download",
        cell: Download
    })
]
