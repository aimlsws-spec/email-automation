// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Yup } from "./Yup";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Forms", path: "/forms" },
  { title: "Form Validation" },
];

const markdownPath = "forms/form-validation";

const demos = [
  {
    title: "React Hook Form",
    description:
      "<a href='https://react-hook-form.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>React Hook Form</a> is a perfect library for validating forms in React. It is a minimal library without any other dependencies, while being performant and straightforward to use, requiring developers to write fewer lines of code than other form libraries.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Yup Example",
    description:
      "<a href='https://github.com/jquense/yup' class='text-primary-600 dark:text-primary-400 hover:underline'>Yup</a> is a perfect library for schema builder for runtime value parsing and validation. It allows you to define a schema, transform a value to match, assert the shape of an existing value, or both",
    Component: Yup,
  
    markdownName: "Yup",
  },
];

export default function FormValidation() {
  return (
    <DemoLayout
      title="Form Validation"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
