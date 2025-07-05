import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const UserMenu = ({ className = "" }: { className?: string }) => {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span
            className={`hidden md:inline text-xs font-normal leading-none !text-xs !font-normal ${className}`}
            style={{ fontSize: '0.75rem', fontWeight: 400, lineHeight: 1, letterSpacing: 0, fontFamily: 'inherit', margin: 0, padding: 0, verticalAlign: 'middle', display: 'inline', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', fontVariant: 'none', fontStyle: 'normal', fontStretch: 'normal', fontFeatureSettings: 'normal', fontKerning: 'auto', fontVariantNumeric: 'normal', fontVariantEastAsian: 'normal', fontVariantLigatures: 'normal', fontVariantCaps: 'normal', fontWeight: '400 !important', fontSize: '0.75rem !important' }}
          >
            {user?.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logga ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
