/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  loginSchema,
  signupSchema,
  LoginInput,
  SignupInput,
} from "@/lib/validation/auth";
import api from "@/lib/axios";
import { useState } from "react";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const schema = isSignup ? signupSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput | SignupInput>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginInput | SignupInput) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      await api.post(endpoint, data);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md w-full"
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {isSignup && (
        <div>
          <Label htmlFor="company">Company</Label>
          <Input {...register("company")} />
          {(errors as any).company && (
            <p className="text-red-500 text-sm">
              {(errors as any).company.message}
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
      </Button>
    </form>
  );
}
