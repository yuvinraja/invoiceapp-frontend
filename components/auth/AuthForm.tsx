/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { authSchema, AuthFormData } from "@/lib/validation/auth";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  // const router = useRouter();
  // const isSignup = mode === "signup";
  // const schema = isSignup ? signupSchema : loginSchema;
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginInput | SignupInput>({
  //   resolver: zodResolver(schema),
  // });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  // const { login, signup } = useAuth();

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    // setError("");
    try {
      // const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      // await api.post(endpoint, data);
      // router.push("/dashboard");
      if (mode === "login") {
        await login(data.email, data.password);
        toast.success("Logged in successfully");
        router.push("/dashboard");
      } else {
        await signup(data.email, data.password);
        toast.success("Account created successfully");
        router.push("/setup-profile");
      }
    } catch (err: unknown) {
      toast.error(
        (err as any).response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Get started with your GST invoice management"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <>
                {"Don't have an account? "}
                <Button variant="link" className="p-0" asChild>
                  <a href="/signup">Sign up</a>
                </Button>
              </>
            ) : (
              <>
                {"Already have an account? "}
                <Button variant="link" className="p-0" asChild>
                  <a href="/login">Sign in</a>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
