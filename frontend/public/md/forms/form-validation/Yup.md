```jsx
// Import Dependencies
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Input, Button } from "components/ui";

// ----------------------------------------------------------------------

const schema = yup.object({
  name: yup.string().required(),
  age: yup.number().required().positive().integer().max(99).min(18),
  email: yup.string().email(),
  website: yup.string().url().nullable(),
});

export function Yup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Enter name"
          classNames={{
            root: "mt-4",
          }}
          {...register("name")}
          error={errors?.name?.message}
        />

        <Input
          placeholder="Enter age"
          classNames={{
            root: "mt-4",
          }}
          {...register("age")}
          error={errors?.age?.message}
        />

        <Input
          placeholder="Enter email"
          classNames={{
            root: "mt-4",
          }}
          {...register("email")}
          error={errors?.email?.message}
        />

        <Input
          placeholder="Enter Website address"
          classNames={{
            root: "mt-4",
          }}
          {...register("website")}
          error={errors?.website?.message}
        />

        <Button className="mt-4" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
```