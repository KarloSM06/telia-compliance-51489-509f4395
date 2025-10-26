import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal = ({ open, onClose }: KeyboardShortcutsModalProps) => {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['←', '→'], description: 'Föregående/Nästa dag/vecka/månad' },
        { keys: ['T'], description: 'Gå till idag' },
        { keys: ['Escape'], description: 'Stäng modaler' },
      ],
    },
    {
      category: 'Vyer',
      items: [
        { keys: ['M'], description: 'Månadsvyn' },
        { keys: ['W'], description: 'Veckovyn' },
        { keys: ['D'], description: 'Dagvyn' },
        { keys: ['Y'], description: 'Årsvyn' },
      ],
    },
    {
      category: 'Åtgärder',
      items: [
        { keys: ['N'], description: 'Ny händelse' },
        { keys: ['Ctrl', 'Z'], description: 'Ångra senaste ändring' },
        { keys: ['Ctrl', 'Enter'], description: 'Spara händelse (i modal)' },
        { keys: ['?'], description: 'Visa tangentbordsgenvägar' },
      ],
    },
    {
      category: 'Sökning & Filtrering',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Fokusera på sökfältet' },
        { keys: ['Ctrl', 'F'], description: 'Öppna filter' },
      ],
    },
  ];

  const KeyBadge = ({ keys }: { keys: string[] }) => (
    <div className="flex gap-1">
      {keys.map((key, i) => (
        <span key={i}>
          <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
            {key}
          </kbd>
          {i < keys.length - 1 && <span className="mx-1">+</span>}
        </span>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Tangentbordsgenvägar
          </DialogTitle>
          <DialogDescription>
            Använd dessa genvägar för att navigera och hantera kalendern snabbare
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                {section.category}
              </h3>
              <Card className="divide-y">
                {section.items.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <span className="text-sm">{shortcut.description}</span>
                    <KeyBadge keys={shortcut.keys} />
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 Tips: Du kan när som helst trycka på <kbd className="px-1 py-0.5 text-xs font-semibold bg-background border border-border rounded">?</kbd> för att visa denna hjälp
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
