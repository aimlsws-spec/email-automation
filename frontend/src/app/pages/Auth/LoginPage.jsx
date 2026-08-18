import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button, Card, Checkbox, Input } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { Page } from "components/shared/Page";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const { login, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    const result = await login({
      username: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
    if (result.success) {
      const redirect = searchParams.get("redirect");
      navigate(redirect || "/", { replace: true });
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  return (
    <Page title="Login">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-800">
        <div className="w-full max-w-[520px] px-6 sm:px-8">
          <div className="text-center">
            <img src="/images/Seawindlogo.png" alt="Seawind" className="mx-auto w-[200px] h-auto" />
            <div className="mt-8">
              <h2 className="text-[42px] font-bold tracking-tight text-gray-800 dark:text-dark-100">
                Welcome Back
              </h2>
              <p className="mt-2 text-lg text-gray-400 dark:text-dark-300">
                Sign in to continue
              </p>
            </div>
          </div>
          <Card className="mt-8 rounded-xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
              <div className="space-y-5">
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  className="h-14 px-4 text-base"
                  prefix={
                    <EnvelopeIcon className="size-[22px] transition-colors duration-200" strokeWidth="1.5" />
                  }
                  {...register("email")}
                  error={errors?.email?.message}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="h-14 px-4 text-base"
                    prefix={
                      <LockClosedIcon className="size-[22px] transition-colors duration-200" strokeWidth="1.5" />
                    }
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:text-dark-300 dark:hover:text-dark-100"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="size-[22px]" />
                        ) : (
                          <EyeIcon className="size-[22px]" />
                        )}
                      </button>
                    }
                    {...register("password")}
                    error={errors?.password?.message}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Checkbox label="Remember me" classNames={{ labelText: "text-base" }} {...register("rememberMe")} />
                <Link
                  to="/forgot-password"
                  className="text-base text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="mt-8 h-14 w-full text-base font-semibold"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-500 dark:text-dark-300">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                  to="/sign-up"
                >
                  Create account
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
