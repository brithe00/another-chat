import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Trash2, Edit3, Key } from "lucide-react";
import { RenameApiKeyDialog } from "./rename-api-key-dialog";
import { DeleteApiKeyDialog } from "./delete-api-key-dialog";

interface ApiKeyCardProps {
  apiKey: {
    id: string;
    provider: string;
    label?: string;
    isActive: boolean;
    createdAt: Date;
  };
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, newLabel: string) => Promise<void>;
}

const providerLogos: Record<string, { name: string; color: string }> = {
  openai: { name: "OpenAI", color: "bg-green-500" },
  anthropic: { name: "Anthropic", color: "bg-orange-500" },
  google: { name: "Google", color: "bg-blue-500" },
  azure: { name: "Azure", color: "bg-sky-500" },
  "amazon-bedrock": { name: "Amazon Bedrock", color: "bg-amber-500" },
};

export function ApiKeyCard({
  apiKey,
  onToggleActive,
  onDelete,
  onRename,
}: ApiKeyCardProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const providerInfo = providerLogos[apiKey.provider.toLowerCase()] || {
    name: apiKey.provider,
    color: "bg-gray-500",
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const handleRename = async (newLabel: string) => {
    await onRename(apiKey.id, newLabel);
  };

  const handleDelete = async () => {
    await onDelete(apiKey.id);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`${providerInfo.color} flex h-10 w-10 items-center justify-center flex-shrink-0`}
            >
              <Key className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold">
                {providerInfo.name}
              </CardTitle>
              <CardDescription className="text-sm truncate">
                {apiKey.label || "No label"}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit label
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                  {apiKey.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Added {formatDate(apiKey.createdAt)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {apiKey.isActive ? "Enabled" : "Disabled"}
              </span>
              <Switch
                checked={apiKey.isActive}
                onCheckedChange={(checked) =>
                  onToggleActive(apiKey.id, checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <RenameApiKeyDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentLabel={apiKey.label}
        provider={providerInfo.name}
        onRename={handleRename}
      />

      <DeleteApiKeyDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        provider={providerInfo.name}
        label={apiKey.label}
        onDelete={handleDelete}
      />
    </>
  );
}
