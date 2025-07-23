import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import UserMenu from "@/components/ui/user-menu";

export function TopNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t('nav.home'),
      url: "/"
    },
    {
      title: t('nav.discover'),
      url: "/discover"
    },
    {
      title: t('nav.saved'),
      url: "/saved"
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-canvas-cloud border-b shadow-sm sticky top-0 z-40" style={{ borderColor: '#F0F1F3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-newsreader font-normal">
                <span style={{ color: '#000000' }}>gr</span>
                <span style={{ color: '#8162F4' }}>ai</span>
                <span style={{ color: '#000000' }}>gent</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            {menuItems.filter(item => item.title !== 'Hem').map(item => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={cn(
                    "px-2 py-2 text-xs font-newsreader transition-colors rounded-md",
                    isActive
                      ? 'text-ink-obsidian font-bold' 
                      : 'text-ink-secondary font-medium hover:text-ink-secondary/70'
                  )}
                  style={isActive ? { borderColor: '#F0F1F3' } : { borderColor: '#F0F1F3' }}
                >
                  {item.title}
                </Link>
              );
            })}
            
            {/* Language Selector and User Menu */}
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <UserMenu />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-ink-obsidian" />
              ) : (
                <Menu className="w-6 h-6 text-ink-obsidian" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-canvas-cloud" style={{ borderColor: '#F0F1F3' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={closeMobileMenu}
                    className={cn(
                      "block px-3 py-3 text-base font-newsreader font-medium transition-colors rounded-md",
                      isActive
                        ? 'text-ink-obsidian font-bold'
                        : 'text-ink-secondary hover:text-ink-secondary/70'
                    )}
                    style={isActive ? { borderColor: '#F0F1F3' } : { borderColor: '#F0F1F3' }}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
