import { Circlebar } from "components/ui";

// ----------------------------------------------------------------------

const Indeterminate = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar size={12} strokeWidth={8} isIndeterminate />
      <Circlebar size={12} strokeWidth={8} color="primary" isIndeterminate />
      <Circlebar size={12} strokeWidth={8} color="secondary" isIndeterminate />
      <Circlebar size={12} strokeWidth={8} color="info" isIndeterminate />
      <Circlebar size={12} strokeWidth={8} color="warning" isIndeterminate />
      <Circlebar size={12} strokeWidth={8} color="success" isIndeterminate />
      <Circlebar size={12} strokeWidth={8} color="error" isIndeterminate />
    </div>
  );
};

export { Indeterminate };
