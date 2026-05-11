// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import {
    AccountNameCell,
    ActivityCell,
    AmountCell,
    TransactionDateCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.activity_name, {
        id: "activity",
        header: "Activity",
        cell: ActivityCell,
    }),
    columnHelper.accessor((row) => row.account_name, {
        id: "account",
        header: "Account",
        cell: AccountNameCell,
    }),
    columnHelper.accessor((row) => row.transaction_date, {
        id: "transaction_date",
        header: "Transaction Date",
        cell: TransactionDateCell,
    }),

    columnHelper.accessor((row) => row.amount, {
        id: "amount",
        header: "Amount",
        cell: AmountCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
]
