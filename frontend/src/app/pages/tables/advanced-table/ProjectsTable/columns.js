// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    CollaboratorsCell,
    PartnerCell,
    ProgressCell,
    ProjectNameCell,
    StartedDateCell,
    TagsCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.partner_name, {
        id: "partner_name",
        header: "Partner",
        cell: PartnerCell,
    }),
    columnHelper.accessor((row) => row.project_name, {
        id: "project_name",
        header: "Project Name",
        cell: ProjectNameCell,
    }),
    columnHelper.display({
        id: "collaborators",
        header: "Collaborators",
        cell: CollaboratorsCell,
    }),
    columnHelper.accessor((row) => row.tags, {
        id: "tags",
        header: "Tags",
        cell: TagsCell,
    }),
    columnHelper.accessor((row) => row.progress, {
        id: "progress",
        header: "progress",
        cell: ProgressCell,
    }),
    columnHelper.accessor((row) => row.started_at, {
        id: "started_at",
        header: "started date",
        cell: StartedDateCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions
    }),
]
