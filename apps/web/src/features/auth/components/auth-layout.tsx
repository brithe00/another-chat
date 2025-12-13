import type { AuthLayoutProps } from "../types";
import { AuthDecorativePanel } from "./auth-decorative-panel";
import { AuthDemoCredentials } from "./auth-demo-credentials";

export function AuthLayout({
  children,
  title,
  subtitle,

  // Demo credentials
  showDemoCredentials = true,
  demoCredentials,
  demoCredentialsTitle,

  // Decorative panel
  showDecorativePanel = true,
  appName,
  tagline,
  description,
  features,
  version,

  // Mobile branding
  showMobileLogo = true,
  mobileLogoIcon = "◈",

  // Footer
  showFooter = true,
  footerText,
}: AuthLayoutProps) {
  const currentYear = new Date().getFullYear();
  const defaultFooterText =
    footerText || `© ${currentYear} ${appName || "Another Chat"}.`;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {showDecorativePanel && (
        <AuthDecorativePanel
          appName={appName}
          tagline={tagline}
          description={description}
          features={features}
          version={version}
        />
      )}

      <div
        className={`w-full ${
          showDecorativePanel ? "lg:w-1/2 lg:ml-[50%]" : ""
        } min-h-screen flex flex-col bg-background`}
      >
        <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {showMobileLogo && (
            <div className="lg:hidden mb-6 text-center">
              <div className="inline-flex items-center gap-2 text-primary">
                <span className="text-xl sm:text-2xl">{mobileLogoIcon}</span>
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  {appName || "Another Chat"}
                </span>
              </div>
            </div>
          )}

          {showDemoCredentials && (
            <AuthDemoCredentials
              credentials={demoCredentials}
              title={demoCredentialsTitle}
            />
          )}

          <div className="mb-6 sm:mb-8 space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-xs sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {showFooter && (
          <div className="py-4 text-center text-xs text-muted-foreground">
            {defaultFooterText}
          </div>
        )}
      </div>
    </div>
  );
}
