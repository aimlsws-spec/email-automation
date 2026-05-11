// Import Dependencies
import { useState } from "react";
import { toast } from "sonner";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Badge } from "components/ui";
import { StyledSwitch } from "components/shared/form/StyledSwitch";

// ----------------------------------------------------------------------

const roleColors = {
  admin: "info",
  superadmin: "error",
  user: "neutral",
  author: "success",
  moderator: "warning",
};

export function AvatarCell({ row }) {
  return (
    <Avatar
      size={10}
      name={row.original.name}
      src={row.original.avatar}
      initialColor="auto"
      classNames={{
        initial: "text-sm",
      }}
    />
  );
}

export function NameCell({ getValue }) {
  return (
    <div className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()}
    </div>
  );
}

export function RoleCell({ getValue }) {
  const val = getValue();
  return (
    <Badge color={roleColors[val]} variant="outlined" className="capitalize">
      {val}
    </Badge>
  );
}

export function StatusCell({
  getValue,
  row: { index },
  column: { id },
  table,
}) {
  const val = getValue();
  const [loading, setLoading] = useState(false);

  const onChange = async (checked) => {
    setLoading(true);
    setTimeout(() => {
      table.options.meta?.updateData(index, id, checked);
      toast.success("User status updated");
      setLoading(false);
    }, 1000);
  };

  return <StyledSwitch checked={val} onChange={onChange} loading={loading} />;
}

AvatarCell.propTypes = {
  row: PropTypes.object,
};

NameCell.propTypes = {
  getValue: PropTypes.func,
};

RoleCell.propTypes = {
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};
