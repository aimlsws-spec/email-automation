// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import { BrandCell, NameCell, PriceCell, StockCell, ViewCell } from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => `${row.name} ${row.sku}`, {
        id: "name",
        header: "name",
        cell: NameCell,
    }),
    columnHelper.accessor((row) => row.category, {
        id: "category",
        header: "category",
    }),
    columnHelper.accessor((row) => row.brand, {
        id: "brand",
        header: "brand",
        cell: BrandCell,
    }),
    columnHelper.accessor((row) => row.price, {
        id: "price",
        header: "Price",
        cell: PriceCell,
    }),
    columnHelper.accessor((row) => row.stock_count, {
        id: "stock_count",
        header: "Stock",
        cell: StockCell,
    }),
    columnHelper.accessor((row) => row.view, {
        id: "views",
        header: "Views",
        cell: ViewCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    })]
