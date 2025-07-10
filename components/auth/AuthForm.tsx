/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  FileText,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authSchema, type AuthFormData } from "@/lib/validation/auth";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
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

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">InvoiceGST</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Shield className="mr-1 h-3 w-3" />
              Secure Authentication
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Sign in to access your GST invoice dashboard"
                : "Join thousands of businesses managing GST invoices efficiently"}
            </p>
          </div>

          {/* Main Form Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">
                {mode === "login" ? "Sign In" : "Get Started"}
              </CardTitle>
              <CardDescription className="text-center">
                {mode === "login"
                  ? "Enter your credentials to continue"
                  : "Create your account to start managing invoices"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="h-11"
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
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="h-11 pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 text-base"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>
              </Form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {mode === "login"
                      ? "New to InvoiceGST?"
                      : "Already have an account?"}
                  </span>
                </div>
              </div>

              <div className="text-center">
                {mode === "login" ? (
                  <div className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      asChild
                    >
                      <Link href="/signup">Create one now</Link>
                    </Button>
                  </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                    Have an account already?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      asChild
                    >
                      <Link href="/login">Log in here</Link>
                    </Button>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Section for Signup */}
          {mode === "signup" && (
            <div className="mt-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Why choose InvoiceGST?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Everything you need to manage GST invoices professionally
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">GST Compliant</h4>
                    <p className="text-xs text-muted-foreground">
                      Generate compliant invoices instantly
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Lightning Fast</h4>
                    <p className="text-xs text-muted-foreground">
                      Create invoices in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Secure & Safe</h4>
                    <p className="text-xs text-muted-foreground">
                      Enterprise-grade security
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Easy Reports</h4>
                    <p className="text-xs text-muted-foreground">
                      Detailed analytics & insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              Trusted by 5+ businesses across India
            </p>
            <div className="flex justify-center items-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                SSL Secured
              </div>
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                GST Compliant
              </div>
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
