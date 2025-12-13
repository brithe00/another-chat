import { createFileRoute } from "@tanstack/react-router";
import { ChatThreadView } from "@/features/chat/components/chat-thread-view";

export const Route = createFileRoute("/_app/")({
  component: ChatThreadView,
});
