
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Grant } from '@/types/grant';

interface GrantApplicationCardProps {
  grant: Grant;
  type: 'active' | 'pending' | 'saved';
  onEdit?: (grantId: string) => void;
  onDelete?: (grantId: string) => void;
  onReadMore?: (grant: Grant) => void;
  onStartApplication?: (grant: Grant) => void;
}

const GrantApplicationCard = ({ 
  grant, 
  type, 
  onEdit, 
  onDelete, 
  onReadMore, 
  onStartApplication 
}: GrantApplicationCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderActions = () => {
    switch (type) {
      case 'active':
        return (
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={() => onEdit?.(grant.id)} 
              className="bg-accent-lime hover:bg-[#D7CFFC] text-ink-obsidian px-6 bg-[#cec5f9]"
            >
              Redigera
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-gray-300 hover:bg-gray-100 bg-white"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ta bort ansökan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Är du säker på att du vill ta bort denna aktiva ansökan? Denna åtgärd kan inte ångras.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete?.(grant.id)} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ta bort
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      case 'pending':
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="border-accent-lavender">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );

      case 'saved':
        return (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="px-4 border-accent-lavender" 
              onClick={() => onReadMore?.(grant)}
            >
              Läs mer
            </Button>
            <Button 
              variant="default" 
              className="bg-accent-lime hover:bg-accent-lime/90 text-ink-obsidian px-6" 
              onClick={() => onStartApplication?.(grant)}
            >
              Börja ansöka
            </Button>
            <Button variant="outline" size="icon" className="border-accent-lavender">
              <Download className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-red-300 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ta bort sparad ansökan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Är du säker på att du vill ta bort denna sparade ansökan? Denna åtgärd kan inte ångras.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete?.(grant.id)} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ta bort
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (type) {
      case 'active':
        return 'Senaste ändring: Uppdaterade "Problem" avsnitt';
      case 'pending':
        return null;
      case 'saved':
        return null;
      default:
        return null;
    }
  };

  const getDateText = () => {
    switch (type) {
      case 'active':
        return `Senast redigerad ${formatDate(new Date())}`;
      case 'pending':
        return `Skickad ${formatDate(new Date())}`;
      case 'saved':
        return `Sparad ${formatDate(new Date())}`;
      default:
        return '';
    }
  };

  return (
    <Card className="p-6 bg-white border border-accent-lavender shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink-obsidian mb-1">{grant.title}</h3>
          {getStatusText() && (
            <p className="text-sm text-ink-secondary mb-1">{getStatusText()}</p>
          )}
          <p className="text-xs text-ink-secondary">{getDateText()}</p>
        </div>
        {renderActions()}
      </div>
    </Card>
  );
};

export default GrantApplicationCard;
