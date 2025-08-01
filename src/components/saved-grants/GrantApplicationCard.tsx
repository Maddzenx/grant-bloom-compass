import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Save, Info, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Grant } from '@/types/grant';
import { useSavedGrantsContext } from '@/contexts/SavedGrantsContext';
import { useNavigate } from 'react-router-dom';

interface GrantApplicationCardProps {
  grant: Grant;
  type: 'active' | 'pending' | 'saved';
  onEdit?: (grantId: string) => void;
  onDelete?: (grantId: string) => void;
  onReadMore?: (grant: Grant) => void;
  onStartApplication?: (grant: Grant) => void;
  onToggleSave?: (grantId: string) => void;
}

const GrantApplicationCard = ({
  grant,
  type,
  onEdit,
  onDelete,
  onReadMore,
  onStartApplication,
  onToggleSave
}: GrantApplicationCardProps) => {
  const {
    isGrantSaved,
    addToSaved,
    removeFromSaved
  } = useSavedGrantsContext();
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sv-SE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleToggleSave = () => {
    const currentlyBookmarked = isGrantSaved(grant.id);
    // Removed expensive console logging to improve performance
    if (currentlyBookmarked) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }

    // Call the parent's toggle function if provided
    if (onToggleSave) {
      onToggleSave(grant.id);
    }
  };

  const handleStartApplication = () => {
    if (onStartApplication) {
      onStartApplication(grant);
    }
  };

  const handleInfoClick = () => {
    console.log('📖 Info button clicked for grant:', grant.id, grant.title);
    navigate('/discover', {
      state: {
        selectedGrant: grant,
        selectedGrantId: grant.id
      }
    });
  };

  const renderActions = () => {
    switch (type) {
      case 'active':
        return <div className="flex gap-2">
            <Button variant="default" onClick={() => onEdit?.(grant.id)} className="bg-accent-lime hover:bg-[#D7CFFC] text-ink-obsidian bg-[#cec5f9] py-0 px-[10px] text-sm h-10">
              Redigera
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-white bg-[#fefefe]">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Ta bort ansökan?</AlertDialogTitle>
                  <AlertDialogDescription className="text-black">
                    Är du säker på att du vill ta bort denna aktiva ansökan? Denna åtgärd kan inte ångras.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#F0F1F3] hover:bg-[#E5E7EA] text-ink-obsidian border-[#F0F1F3] text-sm">Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete?.(grant.id)} className="bg-red-600 hover:bg-red-700 text-sm">
                    Ta bort
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>;
      case 'pending':
        return <div className="flex gap-2">
            <Button variant="outline" size="icon" className="border-accent-lavender">
              <Download className="w-4 h-4" />
            </Button>
          </div>;
      case 'saved':
        const actuallyBookmarked = isGrantSaved(grant.id);
        return <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={handleInfoClick} className="border-white bg-[#fefefe]">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="default" onClick={handleStartApplication} className="inline-flex items-center justify-center\\n               bg-[#D7CFFC] hover:bg-[#CEC5F9] text-ink-obsidian\\n               text-sm leading-none h-10">
              Börja ansökan
            </Button>
            <Button variant="outline" size="icon" onClick={handleToggleSave} className="border-white bg-white">
              <Bookmark className={`w-4 h-4 ${actuallyBookmarked ? 'text-[#CEC5F9] fill-[#CEC5F9]' : 'text-gray-400'}`} />
            </Button>
          </div>;
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

  return <Card className="p-6 bg-white border border-accent-lavender shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink-obsidian mb-1">{grant.title}</h3>
          {getStatusText() && <p className="text-sm text-ink-secondary mb-1">{getStatusText()}</p>}
          <p className="text-xs text-ink-secondary">{getDateText()}</p>
        </div>
        {renderActions()}
      </div>
    </Card>;
};

export default GrantApplicationCard;
