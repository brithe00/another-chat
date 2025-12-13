import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, EyeOff } from "lucide-react";
import { useForm } from "@tanstack/react-form";

const providers = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "azure", label: "Azure" },
  { value: "amazon-bedrock", label: "Amazon Bedrock" },
];

interface AddApiKeyDialogProps {
  onAdd: (data: { provider: string; apiKey: string; label?: string }) => void;
}

export function AddApiKeyDialog({ onAdd }: AddApiKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const form = useForm({
    defaultValues: {
      provider: "",
      apiKey: "",
      label: "",
    },
    onSubmit: async ({ value }) => {
      await onAdd({
        provider: value.provider,
        apiKey: value.apiKey,
        label: value.label || undefined,
      });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Add your API key to use AI models from different providers. Your
              key will be encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field name="provider">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="apiKey">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showKey ? "text" : "password"}
                      placeholder="sk-..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showKey ? "Hide" : "Show"} API key
                      </span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key will be encrypted before being stored.
                  </p>
                </div>
              )}
            </form.Field>

            <form.Field name="label">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="label">
                    Label{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="label"
                    placeholder="e.g., Production, Personal, Testing..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Give this key a name to help you identify it later.
                  </p>
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={form.state.isSubmitting}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({
                values: state.values,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ values, isSubmitting }) => (
                <Button
                  type="submit"
                  disabled={!values.provider || !values.apiKey || isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add API Key"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
