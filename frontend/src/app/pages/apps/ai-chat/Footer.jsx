// Import Dependencies
import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

// Local Imports
import { Button, Input, Swap, SwapOff, SwapOn } from "components/ui";
import { useChatContext } from "./Chat.context";

// ----------------------------------------------------------------------

const schema = object().shape({
  content: string().required("Please enter the message"),
});

export function Footer() {
  const { newMessage, currentChat } = useChatContext();

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
    setFocus,
    reset,
    watch,
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
  }, [currentChat?.id, reset, setFocus]);

  const watchInput = watch("content");

  const onSubmit = (formData) => {
    newMessage(currentChat?.id, formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="mx-auto w-full max-w-4xl px-4 pb-4"
    >
      <div className="flex h-14 items-center justify-between rounded-full bg-gray-150 px-4 dark:bg-dark-700 lg:px-6">
        <Input
          unstyled
          {...register("content")}
          classNames={{
            root: "w-full",
            input: "placeholder:text-gray-400 dark:placeholder:text-dark-300",
          }}
          placeholder="Ask me anything..."
          className="placeholder:text-gray-400 dark:placeholder:text-dark-300"
        />
        <div className="flex">
          <Button variant="flat" isIcon className="size-9 rounded-full">
            <PhotoIcon className="size-5" />
          </Button>
          <Swap value={watchInput === "" ? "off" : "on"}>
            <SwapOn
              component={Button}
              variant="flat"
              type="submit"
              isIcon
              className="size-9 rounded-full"
            >
              <PaperAirplaneIcon className="size-5 rtl:rotate-180" />
            </SwapOn>
            <SwapOff
              component={Button}
              variant="flat"
              isIcon
              className="size-9 rounded-full"
            >
              <MicrophoneIcon className="size-5" />
            </SwapOff>
          </Swap>
        </div>
      </div>
    </form>
  );
}
