import { MessageSquarePlus } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageResponse } from "@/components/ai-elements/message";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  isStreaming?: boolean;
}

export function ChatMessages({
  messages,
  emptyState,
  isLoading = false,
  isStreaming = false,
}: ChatMessagesProps) {
  if (isLoading) {
    return (
      <Conversation>
        <ConversationContent className="p-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center text-muted-foreground py-12">
              Loading conversation...
            </div>
          </div>
        </ConversationContent>
      </Conversation>
    );
  }

  if (messages.length === 0 && emptyState) {
    return (
      <Conversation>
        <ConversationContent className="p-4">{emptyState}</ConversationContent>
      </Conversation>
    );
  }

  return (
    <Conversation>
      <ConversationContent className="p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 w-fit max-w-[75%] ${
                  message.role === "user"
                    ? "flex-row-reverse ml-auto"
                    : "flex-row mr-auto"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 select-none items-center justify-center text-xs font-medium ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? "U" : "AI"}
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div
                    className={`px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap break-words m-0 text-sm">
                        {message.content}
                      </p>
                    ) : (
                      <MessageResponse className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {message.content}
                      </MessageResponse>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground px-2">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isStreaming &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 w-fit flex-row">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center text-xs font-medium bg-muted">
                    AI
                  </div>
                  <div className="flex items-center px-4 py-2 bg-muted">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

export function ChatEmptyState() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="text-center text-muted-foreground py-12">
        <MessageSquarePlus className="size-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Start a new conversation</p>
        <p className="text-sm mt-2">Send a message to begin chatting with AI</p>
      </div>
    </div>
  );
}
