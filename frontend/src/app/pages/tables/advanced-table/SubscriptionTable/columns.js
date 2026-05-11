// Import Dependencies
import dayjs from "dayjs";
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    AmountCell,
    ClientNameCell,
    LicenseType,
    LicenseValiityCell,
    PurchaseDateCell,
    RenewalDateCell,
} from "./rows";

// ----------------------------------------------------------------------

const today = dayjs();

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.user_name, {
        id: "user_name",
        header: "client",
        cell: ClientNameCell,
    }),
    columnHelper.accessor((row) => row.service_name, {
        id: "service_name",
        header: "service name",
    }),
    columnHelper.accessor((row) => row.license_type, {
        id: "license_type",
        header: "License Type",
        cell: LicenseType,
    }),
    columnHelper.accessor((row) => row.amount, {
        id: "amount",
        header: "Amount",
        cell: AmountCell,
    }),
    columnHelper.accessor((row) => row.purchase_date, {
        id: "purchase_date",
        header: "Purchase Date",
        cell: PurchaseDateCell,
    }),
    columnHelper.accessor((row) => dayjs(row.renewal_date).diff(today), {
        id: "license_valiity",
        header: "License Valiity",
        cell: LicenseValiityCell,
    }),
    columnHelper.accessor((row) => row.renewal_date, {
        id: "renewal_date",
        header: "Renewal Date",
        cell: RenewalDateCell,
    }),
    columnHelper.accessor((row) => row.payment_method, {
        id: "payment_method",
        header: "Payment Method",
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
]
