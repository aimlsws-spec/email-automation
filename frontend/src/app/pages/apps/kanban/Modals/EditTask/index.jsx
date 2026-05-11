// Import Dependencies
import PropTypes from "prop-types";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

// Local Imports
import { Button, Textarea } from "components/ui";
import { useBoardContext } from "../../Board.context";
import { LabelsField } from "./LablesField";
import { AssignsField } from "./AssignsField";
import { DatePicker } from "components/shared/form/Datepicker";
import { ColorField } from "./ColorField";
import { TitleField } from "./TitleField";

// ----------------------------------------------------------------------

const schema = Yup.object().shape({
  title: Yup.string().required("Please enter the title of task"),
  labels: Yup.array(),
  members: Yup.array(),
  description: Yup.string(),
  dueDate: Yup.date().nullable(),
  color: Yup.string().required("Please enter the color"),
});

export function EditTask({ isOpen, close, data, columnData }) {
  return (
    <Transition
      appear
      show={isOpen}
      as={Dialog}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden sm:px-5 sm:py-6"
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
        className="hide-scrollbar relative flex h-full w-full max-w-4xl flex-col overflow-y-auto bg-white p-4 transition-opacity duration-300 dark:bg-dark-700 sm:rounded-lg sm:px-5"
      >
        <EditTaskForm close={close} data={data} columnData={columnData} />
      </TransitionChild>
    </Transition>
  );
}

function EditTaskForm({ close, data, columnData }) {
  const { updateTask, deleteTask } = useBoardContext();

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
      members: data.members,
      dueDate: data.dueDate,
      color: data.color,
      description: data.description,
    },
  });

  const onSubmit = (formData) => {
    updateTask(data.id, formData);
    close();
  };

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="flex gap-3">
        <div className="pt-1">
          <CheckCircleIcon className="size-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <TitleField
              register={register}
              error={errors?.title?.message}
              listName={columnData.name}
            />
            <Button onClick={close} className="px-3 py-1.5 text-xs">
              ESC
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <div className="pt-0.5">
          <InformationCircleIcon className="size-6" />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              name="members"
            />

            <Controller
              render={({ field }) => (
                <DatePicker
                  label="Due date:"
                  placeholder="Choose due date..."
                  options={{
                    dateFormat: "Y-m-d",
                  }}
                  {...field}
                />
              )}
              control={control}
              name="dueDate"
            />

            <Controller
              render={({ field }) => <ColorField fieldProps={field} />}
              name="color"
              control={control}
            />
          </div>
        </div>
      </div>

      {data.cover && (
        <div className="mt-5 flex gap-3">
          <div>
            <PhotoIcon className="size-6" />
          </div>
          <div className="flex-1">
            <div>Cover:</div>
            <div className="mt-2 max-w-xs">
              <div className="min-w-0">
                <img
                  className="w-full rounded-lg object-contain"
                  src={data.cover}
                  alt={data.title}
                />
                <div className="mt-1 flex min-w-0 items-center justify-between">
                  <div className="truncate text-xs">{data.cover}</div>
                  <div className="flex gap-1">
                    <Button variant="flat" isIcon className="size-7">
                      <ArrowUpTrayIcon className="size-4" />
                    </Button>
                    <Button
                      variant="flat"
                      color="error"
                      isIcon
                      className="size-7"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <div className="pt-0.5">
          <DocumentTextIcon className="size-6" />
        </div>
        <div className="flex-1">
          <Textarea
            {...register("description")}
            error={errors?.description?.message}
            placeholder="Task Description"
            label="Description:"
            component={TextareaAutosize}
            maxRows={8}
            minRows={4}
          />
        </div>
      </div>

      <div className="grow"></div>

      <div className="mt-6 flex justify-between">
        <Button
          onClick={() => deleteTask(data.id)}
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
            Update Task
          </Button>
        </div>
      </div>
    </form>
  );
}

EditTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  columnData: PropTypes.object.isRequired,
};

EditTaskForm.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  columnData: PropTypes.object.isRequired,
};
