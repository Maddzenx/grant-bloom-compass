
import { useLocation, Link } from "react-router-dom";
import { Home, Search, FileText, CheckSquare, User, Bookmark, PenTool, PanelLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Discover Grants",
    url: "/discover",
    icon: Search,
  },
];

const applicationItems = [
  {
    title: "Finished / Ongoing Grants",
    url: "/ongoing",
    icon: CheckSquare,
  },
  {
    title: "Write New Grant",
    url: "/editor",
    icon: PenTool,
  },
  {
    title: "Saved Grants",
    url: "/saved",
    icon: Bookmark,
  },
];

const accountItems = [
  {
    title: "Profile Information",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
        <span className="font-semibold text-gray-900 group-data-[collapsible=icon]:hidden">Menu</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-4 group-data-[collapsible=icon]:left-4 group-data-[collapsible=icon]:z-50"
          title={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
      </SidebarHeader>
      <SidebarContent className="bg-gray-50">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2 text-sm">
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
            MY APPLICATIONS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {applicationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2 text-sm">
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
            ACCOUNT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2 text-sm">
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
