// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox"
import { RowActions } from "./RowActions";
import {
    Change24hrCell,
    CollectionCell,
    ItemsCell,
    OwnersCell,
    VolumeCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.collection_name, {
        id: "collection_name",
        header: "collection",
        cell: CollectionCell,
    }),
    columnHelper.accessor((row) => row.volume, {
        id: "volume",
        header: "Volume",
        cell: VolumeCell,
    }),
    columnHelper.accessor((row) => row.change_24hr, {
        id: "change_24hr",
        header: "24H%	",
        cell: Change24hrCell,
    }),
    columnHelper.accessor((row) => row.owners, {
        id: "owners",
        header: "owners",
        cell: OwnersCell,
    }),
    columnHelper.accessor((row) => row.items, {
        id: "items",
        header: "items",
        cell: ItemsCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
]
