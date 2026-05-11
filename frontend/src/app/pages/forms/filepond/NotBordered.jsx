import { FilePond } from "components/shared/form/Filepond";

const NotBordered = () => {
  return (
    <div className="max-w-xl">
      <FilePond filled bordered={false} allowMultiple />
    </div>
  );
};

export { NotBordered };
