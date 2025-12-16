import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavConversations } from "./nav-conversations";
import { LogOut, MessageSquarePlus, Settings } from "lucide-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import {
  useConversations,
  useUpdateConversationTitle,
  useDeleteConversation,
} from "@/features/chat/hooks/use-conversations";
import { RenameConversationDialog } from "@/features/chat/components/rename-conversation-dialog";
import { DeleteConversationDialog } from "@/features/chat/components/delete-conversation-dialog";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/date";
import { useQueryClient } from "@tanstack/react-query";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams({ strict: false });
  const currentChatId = params?.chatId;

  const { data: conversationsData, isLoading } = useConversations({
    includeInactive: false,
  });
  const updateTitle = useUpdateConversationTitle();
  const deleteConversation = useDeleteConversation();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleRename = (id: string) => {
    const conversation = conversationsData?.find((c) => c.id === id);
    if (conversation) {
      setSelectedConversation({ id, title: conversation.title });
      setRenameDialogOpen(true);
    }
  };

  const handleRenameSubmit = async (newTitle: string) => {
    if (selectedConversation) {
      await updateTitle.mutateAsync({
        id: selectedConversation.id,
        title: newTitle,
      });
    }
  };

  const handleDelete = (id: string) => {
    const conversation = conversationsData?.find((c) => c.id === id);
    if (conversation) {
      setSelectedConversation({ id, title: conversation.title });
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedConversation) {
      await deleteConversation.mutateAsync(selectedConversation.id);
      if (selectedConversation.id === currentChatId) {
        navigate({ to: "/" });
      }
    }
  };

  const conversations = useMemo(() => {
    if (!conversationsData) return [];

    return conversationsData.map((conv) => ({
      id: conv.id,
      title: conv.title,
      date: formatDate(conv.updatedAt),
      isActive: conv.id === currentChatId,
    }));
  }, [conversationsData, currentChatId]);

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear();
          navigate({ to: "/login", search: { redirect: "/" } });
        },
      },
    });
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
                    <MessageSquarePlus className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Another Chat</span>
                    <span className="truncate text-xs">AI Assistant</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="New Chat">
                    <Link to="/" className="w-full justify-start gap-2">
                      <MessageSquarePlus className="size-4" />
                      <span>New Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link to="/settings" className="w-full justify-start gap-2">
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <NavConversations
            conversations={conversations}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Log out" onClick={handleLogout}>
                <LogOut className="size-4" />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <RenameConversationDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentTitle={selectedConversation?.title || ""}
        onRename={handleRenameSubmit}
      />

      <DeleteConversationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conversationTitle={selectedConversation?.title || ""}
        onDelete={handleDeleteSubmit}
      />
    </>
  );
}
