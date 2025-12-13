import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { AuthLayout } from "./auth-layout";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your conversations"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    "pl-10 h-11 bg-muted/50 border-transparent",
                    "focus:bg-background focus:border-primary/50",
                    "transition-all duration-200"
                  )}
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p
                  key={error?.message}
                  className="text-xs text-destructive flex items-center gap-1.5"
                >
                  <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={field.name}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    "pr-10 h-11 bg-muted/50 border-transparent",
                    "focus:bg-background focus:border-primary/50",
                    "transition-all duration-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {field.state.meta.errors.map((error) => (
                <p
                  key={error?.message}
                  className="text-xs text-destructive flex items-center gap-1.5"
                >
                  <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              size="lg"
              className={cn(
                "w-full h-11 text-sm font-medium",
                "bg-primary hover:bg-primary/90",
                "transition-all duration-200",
                "group"
              )}
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </Button>
          )}
        </form.Subscribe>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Create account
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
