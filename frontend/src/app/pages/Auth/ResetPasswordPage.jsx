import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button, Card, Input } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { Page } from "components/shared/Page";

const schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuthContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    const result = await resetPassword({ token, password: data.password });
    if (result.success) {
      setSuccess(true);
      toast.success("Password reset successful!");
    } else {
      toast.error(result.message || "Failed to reset password");
    }
  };

  if (!token) {
    return (
      <Page title="Invalid Link">
        <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-800">
          <div className="text-center p-4">
            <h2 className="text-xl font-semibold text-gray-600">Invalid or expired reset link</h2>
            <Link to="/forgot-password" className="text-primary-600 mt-2 inline-block">
              Request a new reset link
            </Link>
          </div>
        </main>
      </Page>
    );
  }

  return (
    <Page title="Reset Password">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-800">
        <div className="w-full max-w-[520px] px-6 sm:px-8">
          <div className="text-center">
            <img src="/images/Seawindlogo.png" alt="Seawind" className="mx-auto w-[200px] h-auto" />
            <div className="mt-8">
              <h2 className="text-[42px] font-bold tracking-tight text-gray-800 dark:text-dark-100">
                {success ? "Password Reset" : "Reset Password"}
              </h2>
              <p className="mt-2 text-lg text-gray-400 dark:text-dark-300">
                {success ? "Your password has been reset successfully" : "Enter your new password"}
              </p>
            </div>
          </div>
          <Card className="mt-8 rounded-xl p-6 sm:p-8 shadow-xl">
            {success ? (
              <div className="text-center space-y-6">
                <div className="size-20 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircleIcon className="size-10 text-green-600" />
                </div>
                <p className="text-base text-gray-500 dark:text-dark-300">
                  Your password has been reset successfully.
                </p>
                <Link to="/login">
                  <Button className="mt-2 h-14 w-full text-base font-semibold" color="primary">
                    Sign in with new password
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
                <div className="space-y-5">
                  <div className="relative">
                    <Input
                      label="New Password"
                      placeholder="Enter new password"
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
                      placeholder="Confirm new password"
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
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </main>
    </Page>
  );
}
