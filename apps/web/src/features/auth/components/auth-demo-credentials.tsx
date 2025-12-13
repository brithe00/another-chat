import type { DemoCredential } from "../types";

interface AuthDemoCredentialsProps {
  credentials?: DemoCredential[];
  title?: string;
  icon?: string;
}

const DEFAULT_CREDENTIALS: DemoCredential[] = [
  { label: "email", value: "demo@example.com" },
  { label: "password", value: "demo1234" },
];

export function AuthDemoCredentials({
  credentials = DEFAULT_CREDENTIALS,
  title = "Demo Credentials",
  icon = "◈",
}: AuthDemoCredentialsProps) {
  if (!credentials || credentials.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-muted/50 border border-border p-3 sm:p-4 space-y-2">
      <div className="flex items-center gap-2 text-primary text-xs font-medium uppercase tracking-wider">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-xs sm:text-sm font-mono space-y-0.5">
        {credentials.map((credential, index) => (
          <p key={index} className="flex flex-wrap gap-x-1">
            <span className="text-muted-foreground">{credential.label}:</span>
            <span className="text-foreground select-all break-all">
              {credential.value}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
