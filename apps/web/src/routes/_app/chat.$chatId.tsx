import { createFileRoute, useLocation } from "@tanstack/react-router";
import { ChatThreadView } from "@/features/chat/components/chat-thread-view";

export const Route = createFileRoute("/_app/chat/$chatId")({
  component: ChatThreadComponent,
});

function ChatThreadComponent() {
  const { chatId } = Route.useParams();
  const location = useLocation();
  const pendingMessage = (location.state as any)?.pendingMessage || null;

  return (
    <ChatThreadView
      key={chatId}
      chatId={chatId}
      pendingMessage={pendingMessage}
    />
  );
}
