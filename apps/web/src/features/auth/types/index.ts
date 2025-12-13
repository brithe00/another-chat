export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface DemoCredential {
  label: string;
  value: string;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;

  // Demo credentials configuration
  showDemoCredentials?: boolean;
  demoCredentials?: DemoCredential[];
  demoCredentialsTitle?: string;

  // Decorative panel configuration
  showDecorativePanel?: boolean;
  appName?: string;
  tagline?: string;
  description?: string;
  features?: Feature[];
  version?: string;

  // Mobile branding
  showMobileLogo?: boolean;
  mobileLogoIcon?: string;

  // Footer
  showFooter?: boolean;
  footerText?: string;
}
