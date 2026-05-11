// Import Dependencies
import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Radio,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { RadioGroup } from "@headlessui/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import clsx from "clsx";
import { useEffect } from "react";

// Local Imports
import { Button, Input } from "components/ui";
import { useBoardContext } from "../Board.context";
import { colors } from "../data";

// ----------------------------------------------------------------------

const schema = Yup.object({
  name: Yup.string().required("Please enter the name of column"),
  color: Yup.string().required("Please select a color"),
});

export function AddColumn({ isOpen, close }) {
  return (
    <Transition
      appear
      show={isOpen}
      as={Dialog}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      onClose={close}
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40"
      />

      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="hide-scrollbar relative flex w-full max-w-md flex-col overflow-y-auto rounded-lg bg-white p-4 transition-opacity duration-300 dark:bg-dark-700 sm:px-5"
      >
        <div className="w-full">
          <DialogTitle
            as="h3"
            className="text-lg text-gray-800 dark:text-dark-100"
          >
            New Column
          </DialogTitle>
          <AddColumnForm close={close} />
        </div>
      </TransitionChild>
    </Transition>
  );
}

function AddColumnForm({ close }) {
  const { createColumn } = useBoardContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setFocus 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      color: "primary",
    },
  });

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit = (data) => {
    createColumn(data);
    close();
  };

  return (
    <form className="pt-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Input
        {...register("name")}
        label="Column Name:"
        error={errors?.name?.message}
        placeholder="Enter Column Name"
      />
      <div className="pt-4">
        <div>Color:</div>

        <Controller
          render={({ field }) => (
            <RadioGroup className="mt-2 flex gap-1.5" {...field}>
              {colors.map((color) => (
                <Radio
                  as={Button}
                  isIcon
                  key={color}
                  value={color}
                  color={color}
                  className={({ checked }) =>
                    clsx(
                      "size-4 rounded-full ring-inherit ring-offset-2 ring-offset-white dark:ring-offset-dark-700",
                      checked && "ring-2",
                    )
                  }
                />
              ))}
            </RadioGroup>
          )}
          name="color"
          control={control}
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={close} variant="flat" className="min-w-[8rem]">
          Cancel
        </Button>
        <Button type="submit" color="primary" className="min-w-[8rem]">
          Create Column
        </Button>
      </div>
    </form>
  );
}

AddColumn.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};

AddColumnForm.propTypes = {
  close: PropTypes.func,
};
