import { useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import UserMenu from "@/components/ui/user-menu";
import { Icon } from '@iconify/react';
import { useAuth } from '@/contexts/AuthContext';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

export function TopNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

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
    // Only show 'Sparade' if user is signed in
    ...(user ? [{
      title: t('nav.saved'),
      url: "/saved"
    }] : [])
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigationClick = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "backdrop-blur sticky top-0 z-40 transition-all duration-300",
        isScrolled 
          ? "bg-[#fefefe]/80 border-b shadow-sm" 
          : "bg-[#fafafa]/80 border-b border-transparent"
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
                {!user ? (
                  <>
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
                  </>
                ) : (
                  <UserMenu />
                )}
              </div>
            </div>
            {/* Mobile Auth Buttons */}
                          <div className="flex-1 flex justify-end items-center md:hidden">
                {!user ? (
                  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                        <Menu className="w-7 h-7" />
                      </button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh] bg-white rounded-t-lg">
                      <div className="flex flex-col">
                        <div className="flex justify-end p-4">
                          <DrawerClose asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                              <X className="w-6 h-6" />
                            </button>
                          </DrawerClose>
                        </div>
                        <nav className="flex flex-col gap-4 px-6 pb-4">
                          <Link to="/" className="text-lg font-medium text-ink-obsidian py-2" onClick={handleNavigationClick}>Hem</Link>
                          <Link to="/discover" className="text-lg font-medium text-ink-obsidian py-2" onClick={handleNavigationClick}>Upptäck</Link>
                        </nav>
                        <div className="p-6 border-t border-gray-200">
                          <div className="flex flex-col gap-3">
                            <Link to="/login" className="text-base font-medium text-ink-obsidian py-2 text-center" onClick={handleNavigationClick}>Logga in</Link>
                            <Link to="/signup" className="bg-accent-lavender hover:bg-accent-lavender/90 text-ink-obsidian text-base font-medium py-2 px-4 rounded-full text-center transition-colors" onClick={handleNavigationClick}>Registrera dig</Link>
                          </div>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <button 
                    onClick={() => signOut()} 
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200 hover:scale-105"
                    title="Logga ut"
                  >
                    <LogOut className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>
          </div>
        </div>
      </nav>
      {/* Bottom Navigation for Mobile */}
      {user ? (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fefefe]/80 border-t-0 md:hidden flex justify-around items-center h-16">
          <Link to="/" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/' ? 'text-purple-600 font-bold' : 'text-gray-500')}>
            <Icon icon="mdi:home" className="text-2xl" />
            <span className="text-xs mt-1">Hem</span>
          </Link>
          <Link to="/discover" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/discover' ? 'text-purple-600 font-bold' : 'text-gray-500')}>
            <Icon icon="mdi:magnify" className="text-2xl" />
            <span className="text-xs mt-1">Upptäck</span>
          </Link>
          <Link to="/saved" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/saved' ? 'text-purple-600 font-bold' : 'text-gray-500')}>
            <Icon icon="mdi:bookmark-outline" className="text-2xl" />
            <span className="text-xs mt-1">Sparade</span>
          </Link>
        </nav>
      ) : null}
    </>
  );
}
