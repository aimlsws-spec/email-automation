// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

const STATUS_STYLE = {
  Sent:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Replied:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Follow-up": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Pending:  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function CampaignCell({ getValue }) {
  const val = getValue();
  return (
    <span className="font-medium text-gray-700 dark:text-dark-200">
      {val || "—"}
    </span>
  );
}

export function SenderCell({ getValue }) {
  const val = getValue();
  return (
    <span className="text-xs text-gray-500 dark:text-dark-400">
      {val || "—"}
    </span>
  );
}

export function DateCell({ getValue }) {
  const val = getValue();
  if (!val) return <span className="text-gray-400">—</span>;
  
  const d = new Date(val);
  return (
    <span className="text-xs font-medium text-gray-600 dark:text-dark-300">
      {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

export function NameCell({ row }) {
  return (
    <div className="flex flex-col">
      <p className="font-semibold text-gray-800 dark:text-dark-100">
        {row.original.name || "Unknown"}
      </p>
      <p className="text-xs text-gray-400 dark:text-dark-400">
        {row.original.email}
      </p>
    </div>
  );
}

export function StatusCell({ getValue }) {
  const val = getValue();
  const statusKey = val && val.startsWith('Follow-up') ? 'Follow-up' : val;
  
  return (
    <span className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
      STATUS_STYLE[statusKey] || "bg-gray-100 text-gray-600"
    )}>
      {val || "Pending"}
    </span>
  );
}

export function FollowUpCell({ getValue }) {
  const val = getValue();
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 dark:bg-dark-600 dark:text-dark-200">
      {val ?? 0}
    </span>
  );
}

export function SubjectCell({ getValue }) {
  const val = getValue();
  return (
    <span className="text-xs italic text-gray-500 dark:text-dark-400 max-w-[150px] truncate block" title={val}>
      {val || "—"}
    </span>
  );
}

export function RepliedCell({ getValue }) {
  const val = getValue();
  return (
    <span className={clsx(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-sm border",
      val ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-400 border-gray-100"
    )}>
      {val ? "Yes" : "No"}
    </span>
  );
}

CampaignCell.propTypes = { getValue: PropTypes.func };
SenderCell.propTypes   = { getValue: PropTypes.func };
DateCell.propTypes     = { getValue: PropTypes.func };
NameCell.propTypes     = { row: PropTypes.object };
StatusCell.propTypes   = { getValue: PropTypes.func };
FollowUpCell.propTypes = { getValue: PropTypes.func };
SubjectCell.propTypes  = { getValue: PropTypes.func };
RepliedCell.propTypes  = { getValue: PropTypes.func };
