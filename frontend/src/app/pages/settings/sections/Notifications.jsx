// Import Dependencies
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "sonner";

// Local Imports
import { Checkbox } from "components/ui";
import { useListState } from "hooks";
import { StyledSwitch } from "components/shared/form/StyledSwitch";

// ----------------------------------------------------------------------

export default function Notifications() {
  const [appNotifications, appNotificationHandlers] = useListState([
    {
      id: "join-team",
      label: "Requests to join team",
      description:
        "Receive notifications when someone wants to join your team.",
      enabled: true,
      editable: false,
    },
    {
      id: "contact-messages",
      label: "Contact Messages",
      description:
        "Receive notifications when someone sends you a message on the app.",
      enabled: true,
      editable: false,
    },
    {
      id: "news-and-updates",
      label: "News and updates",
      description:
        "Receive notifications when we have new features or improvements on our app or services",
      enabled: true,
      editable: false,
    },
    {
      id: "security-alerts",
      label: "Security Alerts",
      description:
        "Notifications when there are changes or issues related to your account security.",
      enabled: true,
      editable: true,
    },
  ]);

  const [emailNotifications, emailNotificationHandlers] = useListState([
    {
      id: "join-team",
      label: "Requests to join team",
      description:
        "Receive notifications when someone wants to join your team.",
      enabled: true,
      editable: false,
    },
    {
      id: "contact-messages",
      label: "Contact Messages",
      description:
        "Receive notifications when someone sends you a message on the app.",
      enabled: true,
      editable: false,
    },
    {
      id: "news-and-updates",
      label: "News and updates",
      description:
        "Receive notifications when we have new features or improvements on our app or services",
      enabled: true,
      editable: false,
    },
    {
      id: "security-alerts",
      label: "Security Alerts",
      description:
        "Notifications when there are changes or issues related to your account security.",
      enabled: true,
      editable: true,
    },
  ]);

  const handleAppNotificationChange = (value, i) => {
    appNotificationHandlers.setItemProp(i, "enabled", value);
  };

  const handleEmailNotificationChange = (value, i) => {
    emailNotificationHandlers.setItemProp(i, "enabled", value);
  };

  return (
    <div className="w-full max-w-3xl 2xl:max-w-5xl">
      <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">
        Notifications
      </h5>
      <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
        Customize your application and email notifications.
      </p>
      <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />

      <div>
        <div>
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            Email Notifications
          </p>
          <p className="mt-0.5">Customize your email notifications</p>
        </div>
        <div className="mt-4 space-y-4">
          {emailNotifications.map((notification, i) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              index={i}
              onChange={handleEmailNotificationChange}
            />
          ))}
        </div>
      </div>

      <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

      <div>
        <div>
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            App Notifications
          </p>
          <p className="mt-0.5">Customize your in-app notifications </p>
        </div>
        <div className="mt-4 space-y-4">
          {appNotifications.map((notification, i) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              index={i}
              onChange={handleAppNotificationChange}
            />
          ))}
        </div>

        <div className="mt-5 pb-4">
          <Checkbox label="Apply this settings for all my devices" />
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  label,
  description,
  editable,
  enabled,
  onChange,
  index,
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = (value) => {
    setLoading(true);
    setTimeout(() => {
      onChange(value, index);
      toast.success("Your changes have been saved");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-between space-x-3 rounded-lg border border-gray-200 p-4 dark:border-dark-500 ">
      <div>
        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
          {label}
        </p>
        <p className="mt-0.5 text-balance">{description}</p>
      </div>
      <StyledSwitch
        size={6}
        checked={enabled}
        onChange={handleChange}
        disabled={editable}
        loading={loading}
      />
    </div>
  );
}

NotificationItem.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  editable: PropTypes.bool,
  enabled: PropTypes.bool,
  onChange: PropTypes.func,
  index: PropTypes.number,
};
