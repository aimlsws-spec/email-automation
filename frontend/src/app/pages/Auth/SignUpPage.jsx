import { useState } from "react";
import { Link } from "react-router";
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button, Card, Input } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { Page } from "components/shared/Page";

const schema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SignUpPage() {
  const { register: registerUser, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (result.success) {
      toast.success("Account created successfully! Please sign in.");
      window.location.href = "/login";
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  return (
    <Page title="Sign Up">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-800">
        <div className="w-full max-w-[520px] px-6 sm:px-8">
          <div className="text-center">
            <img src="/images/Seawindlogo.png" alt="Seawind" className="mx-auto w-[200px] h-auto" />
            <div className="mt-8">
              <h2 className="text-[42px] font-bold tracking-tight text-gray-800 dark:text-dark-100">
                Create Your Account
              </h2>
              <p className="mt-2 text-lg text-gray-400 dark:text-dark-300">
                Register to get started
              </p>
            </div>
          </div>
          <Card className="mt-8 rounded-xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
              <div className="space-y-5">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  className="h-14 px-4 text-base"
                  prefix={<UserIcon className="size-[22px]" strokeWidth="1.5" />}
                  {...register("name")}
                  error={errors?.name?.message}
                />
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  className="h-14 px-4 text-base"
                  prefix={<EnvelopeIcon className="size-[22px]" strokeWidth="1.5" />}
                  {...register("email")}
                  error={errors?.email?.message}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    className="h-14 px-4 text-base"
                    prefix={<LockClosedIcon className="size-[22px]" strokeWidth="1.5" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlashIcon className="size-[22px]" /> : <EyeIcon className="size-[22px]" />}
                      </button>
                    }
                    {...register("password")}
                    error={errors?.password?.message}
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type={showConfirm ? "text" : "password"}
                    className="h-14 px-4 text-base"
                    prefix={<LockClosedIcon className="size-[22px]" strokeWidth="1.5" />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeSlashIcon className="size-[22px]" /> : <EyeIcon className="size-[22px]" />}
                      </button>
                    }
                    {...register("confirmPassword")}
                    error={errors?.confirmPassword?.message}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-8 h-14 w-full text-base font-semibold" color="primary" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-500 dark:text-dark-300">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                  to="/login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
