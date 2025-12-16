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

interface RenameConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  onRename: (newTitle: string) => Promise<void>;
}

export function RenameConversationDialog({
  open,
  onOpenChange,
  currentTitle,
  onRename,
}: RenameConversationDialogProps) {
  const form = useForm({
    defaultValues: {
      title: currentTitle,
    },
    onSubmit: async ({ value }) => {
      await onRename(value.title.trim());
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldValue("title", currentTitle);
    }
  }, [open, currentTitle, form]);

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
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Give this conversation a new name to help you find it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field name="title">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Conversation title..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoFocus
                  />
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
                value: state.values.title,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ value, isSubmitting }) => (
                <Button type="submit" disabled={!value.trim() || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
