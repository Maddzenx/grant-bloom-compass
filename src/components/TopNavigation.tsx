import { useLocation, Link } from "react-router-dom";
import { Home, Search, Bookmark, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
export function TopNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return <nav className="bg-canvas-cloud border-b border-accent-lavender/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#867ace]">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            return <Link key={item.title} to={item.url} className="">
                  
                  <span className="hidden lg:inline text-sm font-bold">{item.title}</span>
                </Link>;
          })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6 text-ink-obsidian" /> : <Menu className="w-6 h-6 text-ink-obsidian" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-accent-lavender/30 bg-canvas-cloud">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            return <Link key={item.title} to={item.url} onClick={closeMobileMenu} className={cn("flex items-center gap-3 px-3 py-3 text-base font-medium transition-colors rounded-md", isActive ? 'bg-white text-ink-obsidian shadow-sm' : 'text-ink-obsidian/80 hover:bg-white hover:shadow-sm')}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>;
          })}
            </div>
          </div>}
      </div>
    </nav>;
}