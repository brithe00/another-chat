import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";

interface RenameApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLabel?: string;
  provider: string;
  onRename: (newLabel: string) => Promise<void>;
}

export function RenameApiKeyDialog({
  open,
  onOpenChange,
  currentLabel,
  provider,
  onRename,
}: RenameApiKeyDialogProps) {
  const form = useForm({
    defaultValues: {
      label: currentLabel || "",
    },
    onSubmit: async ({ value }) => {
      await onRename(value.label.trim());
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldValue("label", currentLabel || "");
    }
  }, [open, currentLabel, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Rename API Key</DialogTitle>
            <DialogDescription className="break-words">
              Update the label for your{" "}
              <span className="font-medium">{provider}</span> API key. This
              helps you identify different keys.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field name="label">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Production, Personal, Testing..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Give this key a meaningful name to help you identify it
                    later.
                  </p>
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.state.isSubmitting}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({
                value: state.values.label,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ value, isSubmitting }) => (
                <Button
                  type="submit"
                  disabled={!value.trim() || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
