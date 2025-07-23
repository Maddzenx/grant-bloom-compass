import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import UserMenu from "@/components/ui/user-menu";
import { Icon } from '@iconify/react';

export function TopNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <nav className={cn(
        "backdrop-blur sticky top-0 z-40 transition-all duration-300",
        isScrolled 
          ? "bg-[#fefefe] border-b shadow-sm" 
          : "bg-[#fafafa] border-b border-transparent"
      )} style={{ borderColor: isScrolled ? '#F0F1F3' : 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-3xl font-newsreader font-normal">
                  <span style={{ color: '#000000' }}>gr</span>
                  <span style={{ color: '#8162F4' }}>ai</span>
                  <span style={{ color: '#000000' }}>gent</span>
                </span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              {menuItems.filter(item => item.title !== 'Hem').map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={cn(
                      "px-3 py-2 text-sm font-newsreader transition-colors rounded-md",
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
              {/* Auth Buttons */}
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="text-sm font-newsreader text-ink-secondary font-medium hover:text-ink-obsidian transition-colors"
                >
                  Logga in
                </Link>
                <Link
                  to="/signup"
                  className="bg-accent-lavender hover:bg-accent-lavender/90 text-ink-obsidian text-sm font-newsreader font-medium px-4 py-2 rounded-full transition-colors"
                >
                  Registrera dig
                </Link>
              </div>
              {/* Language Selector and User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fefefe] border-t-0 md:hidden flex justify-around items-center h-16">
        <Link to="/" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/' ? 'text-indigo-600 font-bold' : 'text-gray-500')}>
          <Icon icon="mdi:home" className="text-2xl" />
          <span className="text-xs mt-1">Hem</span>
        </Link>
        <Link to="/discover" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/discover' ? 'text-indigo-600 font-bold' : 'text-gray-500')}>
          <Icon icon="mdi:magnify" className="text-2xl" />
          <span className="text-xs mt-1">Upptäck</span>
        </Link>
        <Link to="/saved" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/saved' ? 'text-indigo-600 font-bold' : 'text-gray-500')}>
          <Icon icon="mdi:bookmark-outline" className="text-2xl" />
          <span className="text-xs mt-1">Sparade</span>
        </Link>
      </nav>
    </>
  );
}
