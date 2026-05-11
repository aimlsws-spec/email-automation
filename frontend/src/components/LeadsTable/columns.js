// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import { 
    NameCell, 
    StatusCell, 
    FollowUpCell, 
    CampaignCell, 
    SenderCell, 
    DateCell,
    SubjectCell,
    RepliedCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor("campaign_name", {
        header: "Campaign Name",
        cell: CampaignCell,
    }),
    columnHelper.accessor("subject", {
        header: "Subject",
        cell: SubjectCell,
    }),
    columnHelper.accessor((row) => `${row.name} ${row.email}`, {
        id: "name",
        header: "Lead Name",
        cell: NameCell,
    }),
    columnHelper.accessor("company", {
        header: "Company",
    }),
    columnHelper.accessor("sender_email", {
        header: "Sender Email",
        cell: SenderCell,
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: StatusCell,
    }),
    columnHelper.accessor("follow_up_count", {
        header: "Follow-ups",
        cell: FollowUpCell,
    }),
    columnHelper.accessor("has_replied", {
        header: "Replied",
        cell: RepliedCell,
    }),
    columnHelper.accessor("last_activity_at", {
        header: "Last Activity",
        cell: DateCell,
    }),
    columnHelper.accessor("created_at", {
        header: "Created Date",
        cell: DateCell,
    }),
    columnHelper.display({
        id: "actions",
        header: "",
        cell: RowActions,
    }),
];
