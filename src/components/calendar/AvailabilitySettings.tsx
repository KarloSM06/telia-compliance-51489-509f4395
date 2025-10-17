import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAvailability, AvailabilitySlot } from '@/hooks/useAvailability';
import { Plus, Trash2, Clock } from 'lucide-react';

const DAYS = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];

export const AvailabilitySettings = () => {
  const { slots, loading, createSlot, updateSlot, deleteSlot } = useAvailability();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleAddSlot = async () => {
    await createSlot({
      day_of_week: selectedDay,
      start_time: startTime,
      end_time: endTime,
      is_active: true,
    });
    setShowAddModal(false);
    setStartTime('09:00');
    setEndTime('17:00');
  };

  const toggleSlot = async (slot: AvailabilitySlot) => {
    await updateSlot(slot.id, { is_active: !slot.is_active });
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, AvailabilitySlot[]>);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Min Tillgänglighet
              </CardTitle>
              <CardDescription>
                Ange när du är tillgänglig för möten. Röstagenten kan använda denna information för att boka möten.
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till tid
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Laddar...</div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Ingen tillgänglighet inlagd än</p>
              <Button onClick={() => setShowAddModal(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Lägg till din första tillgängliga tid
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {DAYS.map((dayName, dayIndex) => {
                const daySlots = groupedSlots[dayIndex] || [];
                if (daySlots.length === 0) return null;

                return (
                  <div key={dayIndex} className="space-y-2">
                    <h3 className="font-semibold text-sm">{dayName}</h3>
                    <div className="grid gap-2">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={slot.is_active}
                              onCheckedChange={() => toggleSlot(slot)}
                            />
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm">
                                {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                              </span>
                            </div>
                            <Badge variant={slot.is_active ? 'default' : 'secondary'}>
                              {slot.is_active ? 'Aktiv' : 'Inaktiv'}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lägg till tillgänglig tid</DialogTitle>
            <DialogDescription>
              Välj dag och tider när du är tillgänglig för möten
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dag</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
              >
                {DAYS.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Starttid</Label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sluttid</Label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Avbryt
            </Button>
            <Button onClick={handleAddSlot}>Lägg till</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
