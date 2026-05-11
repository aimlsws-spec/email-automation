```jsx
// Import Dependencies
import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

const promise = () =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      Math.random() > 0.5 ? resolve() : reject();
    }, 2000)
  );

export function ConfirmModalExample() {
  const [isOpen, { open, close }] = useDisclosure();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const state = error ? "error" : success ? "success" : "pending";

  const messages = {
    pending: {
      Icon: ExclamationTriangleIcon,
      title: "Are you sure?",
      description:
        "Are you sure you want to delete this record? Once deleted, it cannot be restored.",
      actionText: "Delete",
    },
    success: {
      title: "Record Deleted",
    },
    error: {
      description: 'Ensure internet is on and retry. Contact support if issue remains.',
    },
  };

  const onOk = () => {
    setConfirmLoading(true);
    promise()
      .then(() => {
        setConfirmLoading(false);
        setSuccess(true);
        setError(false);
      })
      .catch(() => {
        setConfirmLoading(false);
        setError(true);
      });
  };

  return (
    <>
      <Button
        onClick={() => {
          setSuccess(false);
          setError(false);
          open();
        }}
      >
        Confirm Modal
      </Button>

      <ConfirmModal
        show={isOpen}
        onClose={close}
        messages={messages}
        onOk={onOk}
        confirmLoading={confirmLoading}
        state={state}
      />
    </>
  );
}
```