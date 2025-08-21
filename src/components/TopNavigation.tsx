import { useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut, Home } from "lucide-react";
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
    // Only show 'Sparade' and 'Business Plan Editor' if user is signed in
    ...(user ? [
      {
        title: t('nav.saved'),
        url: "/saved"
      },
      {
        title: "Business Plan Editor",
        url: "/business-plan-editor"
      }
    ] : [])
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
          ? "bg-[#F9F9F9]/80 shadow-sm" 
          : "bg-[#F9F9F9]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="flex items-center">
                  {/* Circular Logo Icon */}
                  <div className="mr-3">
                    <div className="circular-logo-icon w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300">
                      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                        {/* Circular text path for "ALLAUTLYSNINGAR" */}
                        <defs>
                          <path id="circlePath" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
                        </defs>
                        <text fill="#8B5CF6" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="bold">
                          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                            ALLAUTLYSNINGAR
                          </textPath>
                        </text>
                      </svg>
                    </div>
                  </div>
                  {/* Clean Typography */}
                  <div className="flex flex-col">
                    <span className="text-xl font-inter font-semibold leading-tight text-gray-900">
                      allautlysningar
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              {/* Discover Link */}
              <Link
                to="/discover"
                className={cn(
                  "px-3 py-2 text-sm font-newsreader transition-colors rounded-md",
                  location.pathname === '/discover'
                    ? 'text-ink-obsidian font-bold' 
                    : 'text-ink-secondary font-medium hover:text-ink-secondary/70'
                )}
              >
                {t('nav.discover')}
              </Link>
              
              {/* Saved Grants Link - Only show if user is signed in */}
              {user && (
                <Link
                  to="/saved"
                  className={cn(
                    "px-3 py-2 text-sm font-newsreader transition-colors rounded-md",
                    location.pathname === '/saved'
                      ? 'text-ink-obsidian font-bold' 
                      : 'text-ink-secondary font-medium hover:text-ink-secondary/70'
                  )}
                >
                  {t('nav.saved')}
                </Link>
              )}
              
              {/* Business Plan Editor Link - Only show if user is signed in */}
              {user && (
                <Link
                  to="/business-plan-editor"
                  className={cn(
                    "px-3 py-2 text-sm font-newsreader transition-colors rounded-md",
                    location.pathname === '/business-plan-editor'
                      ? 'text-ink-obsidian font-bold' 
                      : 'text-ink-secondary font-medium hover:text-ink-secondary/70'
                  )}
                >
                  Business Plan Editor
                </Link>
              )}
              {/* Auth Buttons */}
              <div className="flex items-center space-x-3 ml-4">
                {!user ? (
                  <>{/* Sign in/register buttons temporarily hidden */}</>
                ) : (
                  <UserMenu />
                )}
              </div>
            </div>
            {/* Mobile Auth Buttons */}
                          <div className="flex-1 flex justify-end items-center md:hidden">
                {!user ? (
                  <Link to="/discover" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200 hover:scale-105">
                    <Home className="w-6 h-6 text-gray-600 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'} />
                  </Link>
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
          <Link to="/" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/' ? 'font-bold' : 'text-gray-500')} style={location.pathname === '/' ? { color: '#8B5CF6' } : {}}>
            <Icon icon="mdi:home" className="text-2xl" />
            <span className="text-xs mt-1">Hem</span>
          </Link>
          <Link to="/discover" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/discover' ? 'font-bold' : 'text-gray-500')} style={location.pathname === '/discover' ? { color: '#8B5CF6' } : {}}>
            <Icon icon="mdi:magnify" className="text-2xl" />
            <span className="text-xs mt-1">Upptäck</span>
          </Link>
          <Link to="/saved" className={cn("flex flex-col items-center justify-center flex-1 py-2", location.pathname === '/saved' ? 'font-bold' : 'text-gray-500')} style={location.pathname === '/saved' ? { color: '#8B5CF6' } : {}}>
            <Icon icon="mdi:bookmark-outline" className="text-2xl" />
            <span className="text-xs mt-1">Sparade</span>
          </Link>
        </nav>
      ) : null}
    </>
  );
}
