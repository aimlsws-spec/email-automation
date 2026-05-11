// Import Dependencies
import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { StarIcon as StarIconFilled } from "@heroicons/react/20/solid";
import {
  StarIcon as StarIconOutline,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { useTodoContext } from "../Todo.context";
import {
  Button,
  Checkbox,
  Input,
  Swap,
  SwapOff,
  SwapOn,
  Textarea,
} from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { LabelsField } from "./components/LablesField";
import { AssignsField } from "./components/AssignsField";

// ----------------------------------------------------------------------
const schema = Yup.object().shape({
  title: Yup.string().required("Please enter the title of task"),
  labels: Yup.array(),
  assignedTo: Yup.array(),
  description: Yup.string(),
  dueDate: Yup.date().nullable(),
});

export function EditTask({ data, isOpen, close }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={close}>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40"
        />

        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-3xl transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700"
        >
          <EditTaskForm data={data} close={close} />
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

function EditTaskForm({ data, close }) {
  const { setIsDone, setIsImportant, updateTodo, deleteTodo } =
    useTodoContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: data.title,
      labels: data.labels,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      description: data.description,
    },
  });

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const onSubmit = (formData) => {
    updateTodo(data.id, formData);
    close();
  };

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <header className="flex h-14 items-center justify-between bg-gray-100 px-4 dark:bg-dark-800">
        <h3 className="text-base font-medium text-gray-800 dark:text-dark-100">
          Edit Todo
        </h3>
        <div className="flex items-center">
          <div className="flex size-7 items-center justify-center">
            <Checkbox
              checked={data.isDone}
              onChange={(e) => setIsDone(data.id, e.target.checked)}
              className="rounded-full"
            />
          </div>

          <Swap
            value={data.isImportant ? "on" : "off"}
            onChange={(val) => setIsImportant(data.id, val === "on")}
            component={Button}
            isIcon
            variant="flat"
            className="size-7 rounded-full"
          >
            <SwapOn>
              <StarIconFilled className="size-4.5 text-primary-600 dark:text-primary-400" />
            </SwapOn>
            <SwapOff>
              <StarIconOutline className="size-4.5" />
            </SwapOff>
          </Swap>

          <Button
            onClick={close}
            isIcon
            variant="flat"
            className="size-7 rounded-full"
          >
            <XMarkIcon className="size-4.5" />
          </Button>
        </div>
      </header>
      <div className="grid grow grid-cols-1 place-content-start gap-4 overflow-y-auto p-4 sm:grid-cols-2">
        <Input
          {...register("title")}
          error={errors?.title?.message}
          placeholder="Enter Task Titile"
          label="Title"
        />

        <Controller
          render={({ field: { value, onChange, name, onBlur, disabled } }) => (
            <DatePicker
              label="Due date:"
              placeholder="Choose due date..."
              options={{
                enableTime: true,
                time_24hr: true,
              }}
              {...{
                value: value || "",
                onChange,
                name,
                onBlur,
                disabled,
              }}
            />
          )}
          control={control}
          name="dueDate"
        />

        <Controller
          render={({ field: { onChange, value, name } }) => (
            <LabelsField onChange={onChange} value={value} name={name} />
          )}
          control={control}
          name="labels"
        />

        <Controller
          render={({ field: { onChange, value, name } }) => (
            <AssignsField onChange={onChange} value={value} name={name} />
          )}
          control={control}
          name="assignedTo"
        />

        <Textarea
          classNames={{
            root: "sm:col-span-2",
          }}
          {...register("description")}
          label="Description"
          placeholder="Enter Task Description"
          rows={4}
        />
      </div>
      <div className="flex justify-between border-t border-gray-200 p-4 dark:border-dark-500">
        <Button
          onClick={() => deleteTodo(data.id)}
          color="error"
          className="gap-2 md:min-w-[8rem]"
        >
          <TrashIcon className="size-4.5" />
          <div className="max-md:hidden">Delete</div>
        </Button>

        <div className="flex justify-end gap-4">
          <Button onClick={close} variant="flat" className="min-w-[8rem]">
            Cancel
          </Button>
          <Button type="submit" color="primary" className="min-w-[8rem]">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}

EditTask.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};

EditTaskForm.propTypes = {
  data: PropTypes.object,
  close: PropTypes.func,
};
