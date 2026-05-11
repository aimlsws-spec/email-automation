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
        label: 'Row Select',
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.partner_name, {
        id: "partner_name",
        header: "Partner",
        label: 'Partner Name',
        cell: PartnerCell,
    }),
    columnHelper.accessor((row) => row.project_name, {
        id: "project_name",
        header: "Project Name",
        label: 'Project Name',
        cell: ProjectNameCell,
    }),
    columnHelper.accessor((row) => row.collaborators, {
        id: "collaborators",
        header: "Collaborators",
        label: 'Collaborators',
        cell: CollaboratorsCell,
        filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor((row) => row.tags, {
        id: "tags",
        header: "Tags",
        label: 'Tags',
        cell: TagsCell,
        filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor((row) => row.progress, {
        id: "progress",
        header: "progress",
        label: 'Progress',
        cell: ProgressCell,
    }),
    columnHelper.accessor((row) => row.started_at, {
        id: "started_at",
        header: "started date",
        label: "Started Date",
        cell: StartedDateCell,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.deadline, {
        id: "deadline",
        isHiddenColumn: true,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        isHiddenColumn: true,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions
    }),
]
