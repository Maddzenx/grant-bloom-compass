
import { useLocation, Link } from "react-router-dom";
import { Home, Search, FileText, CheckSquare, User, Bookmark, PenTool, PanelLeft } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Hem",
    url: "/",
    icon: Home
  },
  {
    title: "Upptäck bidrag",
    url: "/discover",
    icon: Search
  }
];

const applicationItems = [
  {
    title: "Avslutade / Pågående bidrag",
    url: "/ongoing",
    icon: CheckSquare
  },
  {
    title: "Skriv nytt bidrag",
    url: "/editor",
    icon: PenTool
  },
  {
    title: "Sparade bidrag",
    url: "/saved",
    icon: Bookmark
  }
];

const accountItems = [
  {
    title: "Profilinformation",
    url: "/profile",
    icon: User
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      {/* Toggle button for collapsed state - positioned better */}
      {state === "collapsed"}
      
      <Sidebar className="border-r border-gray-200">
        {/* Minimize button positioned at top right of sidebar */}
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar} 
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors group-data-[collapsible=icon]:hidden" 
            title="Dölj sidopanel"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        </div>

        <SidebarContent className="bg-[#f8f4ec] pt-16 py-[6px] mx-0">
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-0">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 bg-[#f8f4ec]">
              MINA ANSÖKNINGAR
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {applicationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-0">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 bg-[#f8f4ec]">
              KONTO
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
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
    </>
  );
}
