import AuthForm from "@/components/form/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AuthForm mode="signup" />
    </div>
  );
}
