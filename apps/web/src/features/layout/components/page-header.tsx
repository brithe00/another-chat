import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <header
      className={
        className ||
        "flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4"
      }
    >
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2" />
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
