import { useState } from "react";
import { Link } from "react-router";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button, Card, Input } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { Page } from "components/shared/Page";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthContext();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setSubmitted(true);
      toast.success("If an account exists, a reset link has been sent.");
    } else {
      toast.error(result.message || "Something went wrong");
    }
  };

  return (
    <Page title="Forgot Password">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-800">
        <div className="w-full max-w-[520px] px-6 sm:px-8">
          <div className="text-center">
            <img src="/images/Seawindlogo.png" alt="Seawind" className="mx-auto w-[200px] h-auto" />
            <div className="mt-8">
              <h2 className="text-[42px] font-bold tracking-tight text-gray-800 dark:text-dark-100">
                Forgot Password
              </h2>
              <p className="mt-2 text-lg text-gray-400 dark:text-dark-300">
                {submitted
                  ? "Check your email for the reset link"
                  : "Enter your email to receive a reset link"}
              </p>
            </div>
          </div>
          <Card className="mt-8 rounded-xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="text-center space-y-6">
                <div className="size-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <EnvelopeIcon className="size-10 text-primary-600" />
                </div>
                <p className="text-base text-gray-500 dark:text-dark-300">
                  We&apos;ve sent a password reset link to your email. Please check your inbox.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-base font-semibold text-primary-600 hover:text-primary-800"
                >
                  <ArrowLeftIcon className="size-5" />
                  Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
                <div className="space-y-5">
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    className="h-14 px-4 text-base"
                    prefix={<EnvelopeIcon className="size-[22px]" strokeWidth="1.5" />}
                    {...register("email")}
                    error={errors?.email?.message}
                  />
                </div>
                <Button type="submit" className="mt-8 h-14 w-full text-base font-semibold" color="primary" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-base text-gray-400 hover:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100"
                  >
                    <ArrowLeftIcon className="size-5" />
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </Card>
        </div>
      </main>
    </Page>
  );
}
