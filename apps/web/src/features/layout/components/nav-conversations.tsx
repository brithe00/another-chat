import { MessageSquare, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavConversationsProps {
  conversations: {
    id: string;
    title: string;
    date: string;
    isActive?: boolean;
  }[];
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NavConversations({
  conversations,
  onRename,
  onDelete,
}: NavConversationsProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarMenu>
        {conversations.map((conversation) => (
          <SidebarMenuItem key={conversation.id}>
            <SidebarMenuButton
              asChild
              isActive={conversation.isActive}
              tooltip={conversation.title}
            >
              <Link to="/chat/$chatId" params={{ chatId: conversation.id }}>
                <MessageSquare />
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="truncate w-full">{conversation.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {conversation.date}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => onRename?.(conversation.id)}>
                  <Edit3 className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(conversation.id)}
                >
                  <Trash2 className="text-destructive" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
