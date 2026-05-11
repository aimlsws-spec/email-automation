// Import Dependencies
import {
  FaceSmileIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import clsx from "clsx";

// Local Imports
import { Button, Input } from "components/ui";
import { useChatContext } from "../Chat.context";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

const schema = object().shape({
  content: string().required("Please enter the message"),
});

export function Footer() {
  const { newMessage, currentChat } = useChatContext();
  const { cardSkin } = useThemeContext();

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
    setFocus,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset();
    setTimeout(() => setFocus("content"));
  }, [currentChat.id, reset, setFocus]);

  const onSubmit = (formData) => {
    newMessage(currentChat.id, formData);
  };

  return (
    <div
      className={clsx(
        cardSkin === "bordered" ? "dark:bg-dark-900" : "dark:bg-dark-750",
        "chat-footer transition-content relative h-12 w-full shrink-0 border-t border-gray-150 bg-white px-[calc(var(--margin-x)-.25rem)] dark:border-dark-600",
      )}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="-mx-2 flex h-full items-center"
      >
        <div className="flex flex-1 items-center gap-2">
          <Button variant="flat" isIcon className="size-9 rounded-full">
            <PaperClipIcon className="size-5" />
          </Button>
          <Input
            unstyled
            {...register("content")}
            classNames={{
              root: "w-full",
              input: "placeholder:text-gray-400 dark:placeholder:text-dark-300",
            }}
            placeholder="Write a message..."
          />
        </div>
        <div className="flex">
          <Button variant="flat" isIcon className="size-9 rounded-full">
            <FaceSmileIcon className="size-5" />
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="flat"
            isIcon
            className="size-9 rounded-full"
          >
            <PaperAirplaneIcon className="size-5 rtl:rotate-180" />
          </Button>
        </div>
      </form>
    </div>
  );
}
