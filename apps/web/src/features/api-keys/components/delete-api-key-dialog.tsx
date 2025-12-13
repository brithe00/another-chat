import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: string;
  label?: string;
  onDelete: () => Promise<void>;
}

export function DeleteApiKeyDialog({
  open,
  onOpenChange,
  provider,
  label,
  onDelete,
}: DeleteApiKeyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting API key:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Delete API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this API key?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden">
          <div className="space-y-2 min-w-0">
            <div className="border p-3 bg-muted/50 overflow-hidden min-w-0">
              <div className="font-medium truncate">{provider}</div>
              {label && (
                <div
                  className="text-sm text-muted-foreground truncate"
                  title={label}
                >
                  {label}
                </div>
              )}
            </div>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="break-words">
              This action cannot be undone. You will need to add the API key
              again if you want to use this provider in the future.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground">
            Any ongoing conversations using this API key will be unable to
            continue.
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete API Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
