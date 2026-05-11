// Import Dependencies
import { useForm } from "react-hook-form";

// Local Imports
import { Input, Button } from "components/ui";

// ----------------------------------------------------------------------

export function Basic() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  const formOption = {
    name: { required: "Name is required" },
    age: {
      required: "Age is required",
      min: {
        value: 18,
        message: "Value must be between 18 - 99",
      },
      max: {
        value: 99,
        message: "Value must be between 18 - 99",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
    },
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Enter Your name"
          classNames={{
            root: "mt-4",
          }}
          {...register("name", formOption.name)}
          error={errors?.name && errors.name.message}
        />

        <Input
          placeholder="Enter Your age"
          classNames={{
            root: "mt-4",
          }}
          type="number"
          {...register("age", formOption.age)}
          error={errors?.age && errors.age.message}
        />

        <Input
          placeholder="Enter Your Password"
          classNames={{
            root: "mt-4",
          }}
          type="password"
          {...register("password", formOption.password)}
          error={errors?.password && errors.password.message}
        />

        <Button className="mt-4" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
