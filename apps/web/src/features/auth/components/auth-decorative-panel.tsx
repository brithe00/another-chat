import type { Feature } from "../types";

interface AuthDecorativePanelProps {
  appName?: string;
  tagline?: string;
  description?: string;
  features?: Feature[];
  version?: string;
}

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: "◈",
    title: "Multi-provider",
    description: "OpenAI, Anthropic, and more",
  },
  {
    icon: "◉",
    title: "API Keys",
    description: "Your keys, your control",
  },
  {
    icon: "◇",
    title: "Conversations",
    description: "Persistent history",
  },
  {
    icon: "◆",
    title: "Open Source",
    description: "Transparent and free",
  },
];

export function AuthDecorativePanel({
  appName = "Another Chat",
  tagline = "A modern and elegant chat interface.",
  description = "Connect to your favorite AI models.",
  features = DEFAULT_FEATURES,
  version = "0.0.1-alpha",
}: AuthDecorativePanelProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:inset-y-0 lg:left-0 relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 flex flex-col justify-center px-8 xl:px-16 w-full">
        <div className="space-y-6 max-w-lg">
          <div className="text-primary/80 text-[10px] xl:text-xs leading-none font-mono overflow-hidden">
            <pre className="select-none whitespace-pre">{` _____ _____ _____ _____ _____ _____ _____
|  _  |   | |     |_   _|  |  |   __| __  |
|     | | | |  |  | | | |     |   __|    -|
|__|__|_|___|_____| |_| |__|__|_____|__|__|

 _____ _____ _____ _____
|     |  |  |  _  |_   _|
|   --|     |     | | |
|_____|__|__|__|__| |_|`}</pre>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl xl:text-3xl font-bold text-white tracking-tight">
              {appName}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {tagline}
              <br />
              {description}
            </p>
          </div>

          {features.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-6">
              {features.map((feature, index) => (
                <FeatureBlock key={index} {...feature} />
              ))}
            </div>
          )}

          {version && (
            <div className="pt-8 text-xs text-gray-600 font-mono">
              <span className="text-primary">$</span> v{version} /{" "}
              <span className="text-gray-500">ready</span>
              <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>

      <svg
        className="absolute bottom-0 right-0 w-1/2 h-1/2 text-primary/5"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {[...Array(10)].map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={i * 10}
            x2={100}
            y2={i * 10 + 50}
            stroke="currentColor"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
}

function FeatureBlock({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group">
      <div className="flex items-start gap-2 xl:gap-3">
        <span className="text-primary text-base xl:text-lg group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <div>
          <h3 className="text-white text-xs xl:text-sm font-medium">{title}</h3>
          <p className="text-gray-500 text-[10px] xl:text-xs mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
