import { FileChartPie, Home, Inbox, Search, Settings, Archive, Activity, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom"; // Import Link for navigation

// Menu items with role-based access
const items = [
  {
    title: "Home",
    url: "/user",
    icon: User,
  },
  {
    title: "Emotion Model Manager",
    url: "/emotion",
    icon: Activity,
  },
  {
    title: "Records",
    url: "/communications",
    icon: Archive,
  },
  {
    title: "Analysis",
    url: "/analysis",
    icon: FileChartPie,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
