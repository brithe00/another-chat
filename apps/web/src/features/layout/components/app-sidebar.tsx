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
import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";
import { NavConversations } from "./nav-conversations";
import { MessageSquarePlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

const conversations = [
  { id: "1", title: "Hello World Example", date: "Today", isActive: true },
  { id: "2", title: "React Components Help", date: "Yesterday" },
  { id: "3", title: "API Integration", date: "2 days ago" },
  { id: "4", title: "Building a Chat App", date: "3 days ago" },
  { id: "5", title: "Debugging Tips", date: "1 week ago" },
];

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
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
                <SidebarMenuButton asChild>
                  <Button
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <MessageSquarePlus className="size-4" />
                    <span>New Chat</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavConversations conversations={conversations} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
