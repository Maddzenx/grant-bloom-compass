import { useLocation, Link } from "react-router-dom";
import { Home, Search, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";
const menuItems = [{
  title: "Hem",
  url: "/",
  icon: Home
}, {
  title: "Upptäck bidrag",
  url: "/discover",
  icon: Search
}, {
  title: "Sparade bidrag",
  url: "/saved",
  icon: Bookmark
}];
const accountItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: User
}, {
  title: "Profilinformation",
  url: "/profile",
  icon: User
}];
export function TopNavigation() {
  const location = useLocation();
  return <nav className="bg-[#f8f4ec] border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Main navigation items */}
        <div className="flex items-center space-x-6">
          {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.url;
          return <Link key={item.title} to={item.url} className={cn("flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md", isActive ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm')}>
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>;
        })}
        </div>

        {/* Account items */}
        <div className="flex items-center space-x-4">
          {accountItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.url;
          return;
        })}
        </div>
      </div>
    </nav>;
}