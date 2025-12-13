import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { AuthLayout } from "./auth-layout";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
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
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/",
            });
            toast.success("Account created successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
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
      title="Create an account"
      subtitle="Join Another Chat and start conversing"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
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
              <Label
                htmlFor={field.name}
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <div className="relative group">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
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

              <PasswordStrength password={field.state.value} />
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-xs text-muted-foreground text-center">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <div className="relative py-2">
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
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);

  if (!password) return null;

  const labels = ["Very weak", "Weak", "Fair", "Good", "Excellent"];
  const colors = [
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 transition-all duration-300",
              i < strength ? colors[strength - 1] : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength:{" "}
        <span
          className={cn(
            "font-medium",
            strength <= 1 && "text-destructive",
            strength === 2 && "text-orange-500",
            strength === 3 && "text-yellow-500",
            strength >= 4 && "text-green-500"
          )}
        >
          {labels[strength - 1] || "Very weak"}
        </span>
      </p>
    </div>
  );
}
