// Import Dependencies
import {
  DocumentTextIcon,
  FilmIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Avatar } from "components/ui";
import { formatBytes } from "utils/formatBytes";

// ----------------------------------------------------------------------

const fileColor = {
  mp3: "secondary",
  mp4: "warning",
  pdf: "info",
  ppt: "success",
};

function getMediaIcon(ext) {
  if (ext === "mp4") return FilmIcon;
  if (ext === "mp3") return MusicalNoteIcon;
  return DocumentTextIcon;
}

const permissionColor = {
  view: "text-gray-800 dark:text-dark-100",
  "can-edit": "this:success text-this dark:text-this-lighter",
};

export function CourseNameCell({ row, getValue }) {
  const fileExt = row.original.file_name.split(".").pop();
  const Icon = getMediaIcon(fileExt);

  return (
    <div className="flex w-64 items-center space-x-4 whitespace-normal ">
      <Avatar
        size={9}
        initialColor={fileColor[fileExt]}
        classNames={{
          display: "rounded-lg",
        }}
      >
        <Icon className="size-5" />
      </Avatar>
      <span className="line-clamp-2 text-gray-800 dark:text-dark-100">
        {getValue()}
      </span>
    </div>
  );
}

export function FileNameCell({ getValue }) {
  return (
    <div className="max-w-xs truncate">
      <a href="##" className="hover:underline focus:underline">
        {getValue()}
      </a>
    </div>
  );
}

export function PermissionCell({ row, getValue }) {
  return (
    <div
      className={clsx(
        "inline-flex items-center space-x-2 leading-none ",
        permissionColor[row.original.permission.key],
      )}
    >
      <span className="size-2 rounded-full bg-current"></span>
      <span className="text-xs font-medium">{getValue()}</span>
    </div>
  );
}

export function AssignCell({ getValue }) {
  return <span>{getValue()} Members</span>;
}

export function SizeCell({ getValue }) {
  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      {formatBytes(getValue())}
    </span>
  );
}

CourseNameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

FileNameCell.propTypes = {
  getValue: PropTypes.func,
};

PermissionCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

AssignCell.propTypes = {
  getValue: PropTypes.func,
};

SizeCell.propTypes = {
  getValue: PropTypes.func,
};
