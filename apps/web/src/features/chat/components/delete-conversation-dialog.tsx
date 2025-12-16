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

interface DeleteConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationTitle: string;
  onDelete: () => Promise<void>;
}

export function DeleteConversationDialog({
  open,
  onOpenChange,
  conversationTitle,
  onDelete,
}: DeleteConversationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this conversation?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="border p-3 bg-muted/50 rounded-md">
            <div className="font-medium truncate">{conversationTitle}</div>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription>
              This action cannot be undone. All messages in this conversation
              will be permanently deleted.
            </AlertDescription>
          </Alert>
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
