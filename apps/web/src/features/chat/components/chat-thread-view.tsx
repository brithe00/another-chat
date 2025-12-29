import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
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
  conversationKeys,
} from "../hooks/use-conversations";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { useQueryClient } from "@tanstack/react-query";

interface ChatThreadViewProps {
  chatId?: string;
}

interface LocationState {
  initialMessage?: string;
}

export function ChatThreadView({ chatId }: ChatThreadViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const initialMessageSentRef = useRef(false);

  const initialMessage = (location.state as LocationState)?.initialMessage;

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
          { credentials: "include" }
        )
      : (undefined as any),
    onError: (error) => {
      setIsStreaming(false);
      toast.error(error.message || "Failed to send message");
    },
    onFinish: () => {
      setIsStreaming(false);
      if (chatId) {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.detail(chatId),
        });
      }
    },
  });

  useEffect(() => {
    if (!chatId || !initialMessage || initialMessageSentRef.current) return;

    initialMessageSentRef.current = true;
    setIsStreaming(true);
    chat.sendMessage(initialMessage);

    navigate({
      to: "/chat/$chatId",
      params: { chatId },
      replace: true,
    });
  }, [chatId, initialMessage, chat, navigate]);

  const dbMessages = useMemo(() => {
    return (
      conversation?.messages
        ?.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }))
        .filter((msg) => msg.content.trim()) || []
    );
  }, [conversation?.messages]);

  const streamMessages = useMemo(() => {
    return chat.messages
      .map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content:
          msg.parts
            .filter((part) => part.type === "text")
            .map((part) => (part as any).content)
            .join("")
            .trimStart() || "",
        timestamp: new Date(),
      }))
      .filter((msg) => msg.content.trim());
  }, [chat.messages]);

  const allMessages = useMemo(() => {
    if (streamMessages.length === 0) {
      return dbMessages;
    }

    const normalize = (s: string) => s.trim();
    const dbContents = new Set(
      dbMessages.map((m) => `${m.role}:${normalize(m.content)}`)
    );

    const newStreamMessages = streamMessages.filter(
      (m) => !dbContents.has(`${m.role}:${normalize(m.content)}`)
    );

    return [...dbMessages, ...newStreamMessages];
  }, [dbMessages, streamMessages]);

  const isNewChat = !chatId;
  const chatTitle = conversation?.title || "New Chat";

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
          state: { initialMessage: message } as unknown as undefined,
        });
      } catch (error) {}
    } else {
      setIsStreaming(true);
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
            isStreaming={isStreaming}
          />

          <ChatInput
            onSubmit={handleSubmit}
            isLoading={isStreaming || createConversation.isPending}
            disabled={!isNewChat && !conversation}
            conversationModel={conversation?.model}
            conversationProvider={conversation?.provider}
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
