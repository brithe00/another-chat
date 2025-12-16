import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChatHeader } from "./chat/chat-header";
import { ChatMessages, ChatEmptyState } from "./chat/chat-messages";
import { ChatInput } from "./chat/chat-input";
import { RenameConversationDialog } from "./rename-conversation-dialog";
import { DeleteConversationDialog } from "./delete-conversation-dialog";
import {
  useConversation,
  useCreateConversation,
  useUpdateConversationTitle,
  useDeleteConversation,
} from "../hooks/use-conversations";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

interface ChatThreadViewProps {
  chatId?: string;
  pendingMessage?: string | null;
}

/* WIP */
export function ChatThreadView({
  chatId,
  pendingMessage,
}: ChatThreadViewProps) {
  const navigate = useNavigate();
  const [hasSentPending, setHasSentPending] = useState(false);

  const { data: conversation, isLoading: isLoadingConversation } =
    useConversation(chatId);

  const createConversation = useCreateConversation();
  const updateTitle = useUpdateConversationTitle();
  const deleteConversation = useDeleteConversation();

  const chat = useChat({
    connection: chatId
      ? fetchServerSentEvents(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/conversations/${chatId}/stream`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        )
      : (undefined as any),
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const allMessages = useMemo(() => {
    return chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content:
        msg.parts
          ?.filter((part) => part.type === "text")
          .map((part) => (part as any).content)
          .join("")
          .trimStart() || "",
      timestamp: new Date(),
    }));
  }, [chat.messages]);

  const isNewChat = !chatId;
  const chatTitle = conversation?.title || "New Chat";

  useEffect(() => {
    if (pendingMessage && !hasSentPending && chatId && !chat.isLoading) {
      console.log("🚀 Auto-sending pending message:", pendingMessage);
      setHasSentPending(true);
      chat.sendMessage(pendingMessage);
    }
  }, [pendingMessage, hasSentPending, chatId, chat.isLoading]);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSubmit = async (
    message: string,
    selectedModel: string,
    provider: string
  ) => {
    if (!message.trim()) return;

    if (isNewChat) {
      try {
        const result = await createConversation.mutateAsync({
          model: selectedModel,
          provider,
          initialMessage: message,
          saveInitialMessage: false,
        });

        navigate({
          to: "/chat/$chatId",
          params: { chatId: result.conversation.id },
          state: { pendingMessage: message } as any,
        });
      } catch (error) {}
    } else {
      chat.sendMessage(message);
    }
  };

  const handleRename = () => {
    if (!chatId) return;
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async (newTitle: string) => {
    if (!chatId) return;
    await updateTitle.mutateAsync({ id: chatId, title: newTitle });
  };

  const handleDelete = () => {
    if (!chatId) return;
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!chatId) return;
    await deleteConversation.mutateAsync(chatId);
    navigate({ to: "/" });
  };

  return (
    <>
      <SidebarInset>
        <div className="flex flex-col h-full">
          <ChatHeader
            title={chatTitle}
            onRename={!isNewChat ? handleRename : undefined}
            onDelete={!isNewChat ? handleDelete : undefined}
            showActions={!isNewChat}
          />

          <ChatMessages
            messages={allMessages}
            emptyState={<ChatEmptyState />}
            isLoading={isLoadingConversation}
            isStreaming={chat.isLoading}
          />

          <ChatInput
            onSubmit={handleSubmit}
            isLoading={chat.isLoading || createConversation.isPending}
            disabled={!isNewChat && !conversation}
          />
        </div>
      </SidebarInset>

      <RenameConversationDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentTitle={chatTitle}
        onRename={handleRenameSubmit}
      />

      <DeleteConversationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conversationTitle={chatTitle}
        onDelete={handleDeleteSubmit}
      />
    </>
  );
}
