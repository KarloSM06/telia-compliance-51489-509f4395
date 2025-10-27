import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Mail, Phone, UserPlus, Trash2, Edit } from "lucide-react";
import { useNotificationRecipients, type NotificationRecipient } from "@/hooks/useNotificationRecipients";
import { Badge } from "@/components/ui/badge";

export function NotificationRecipientForm() {
  const { recipients, createRecipient, updateRecipient, deleteRecipient, isCreating } = useNotificationRecipients();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notify_on_new_booking: true,
    notify_on_booking_cancelled: true,
    notify_on_booking_updated: true,
    notify_on_new_review: false,
    notify_on_message_failed: false,
    enable_email_notifications: true,
    enable_sms_notifications: false,
    quiet_hours_start: "",
    quiet_hours_end: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      notify_on_new_booking: true,
      notify_on_booking_cancelled: true,
      notify_on_booking_updated: true,
      notify_on_new_review: false,
      notify_on_message_failed: false,
      enable_email_notifications: true,
      enable_sms_notifications: false,
      quiet_hours_start: "",
      quiet_hours_end: "",
      is_active: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name || (!formData.email && !formData.phone)) {
      return;
    }

    if (editingId) {
      updateRecipient({ id: editingId, updates: formData });
    } else {
      createRecipient(formData);
    }
    resetForm();
  };

  const handleEdit = (recipient: NotificationRecipient) => {
    setFormData({
      name: recipient.name,
      email: recipient.email || "",
      phone: recipient.phone || "",
      notify_on_new_booking: recipient.notify_on_new_booking,
      notify_on_booking_cancelled: recipient.notify_on_booking_cancelled,
      notify_on_booking_updated: recipient.notify_on_booking_updated,
      notify_on_new_review: recipient.notify_on_new_review,
      notify_on_message_failed: recipient.notify_on_message_failed,
      enable_email_notifications: recipient.enable_email_notifications,
      enable_sms_notifications: recipient.enable_sms_notifications,
      quiet_hours_start: recipient.quiet_hours_start || "",
      quiet_hours_end: recipient.quiet_hours_end || "",
      is_active: recipient.is_active,
    });
    setEditingId(recipient.id);
    setIsAdding(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Notifikationsmottagare
            </CardTitle>
            <CardDescription>
              Lägg till kollegor som ska få notifikationer
            </CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Lägg till
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Recipients */}
        {recipients.length > 0 && (
          <div className="space-y-3">
            {recipients.map((recipient) => (
              <Card key={recipient.id} className="border">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{recipient.name}</h4>
                        {!recipient.is_active && (
                          <Badge variant="secondary">Inaktiv</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {recipient.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {recipient.email}
                          </div>
                        )}
                        {recipient.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {recipient.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {recipient.enable_email_notifications && (
                          <Badge variant="outline" className="text-xs">E-post</Badge>
                        )}
                        {recipient.enable_sms_notifications && (
                          <Badge variant="outline" className="text-xs">SMS</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(recipient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecipient(recipient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">
                  {editingId ? "Redigera mottagare" : "Ny mottagare"}
                </h4>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Namn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="T.ex. Anna Svensson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anna@foretag.se"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+46701234567"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>Notifikationskanaler</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-email" className="cursor-pointer">E-post</Label>
                    <Switch
                      id="enable-email"
                      checked={formData.enable_email_notifications}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, enable_email_notifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-sms" className="cursor-pointer">SMS</Label>
                    <Switch
                      id="enable-sms"
                      checked={formData.enable_sms_notifications}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, enable_sms_notifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>Händelser att notifiera om</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-booking" className="cursor-pointer">Nya bokningar</Label>
                    <Switch
                      id="new-booking"
                      checked={formData.notify_on_new_booking}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, notify_on_new_booking: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cancelled" className="cursor-pointer">Avbokningar</Label>
                    <Switch
                      id="cancelled"
                      checked={formData.notify_on_booking_cancelled}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, notify_on_booking_cancelled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="updated" className="cursor-pointer">Ändrade bokningar</Label>
                    <Switch
                      id="updated"
                      checked={formData.notify_on_booking_updated}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, notify_on_booking_updated: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Tyst tid start</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={formData.quiet_hours_start}
                    onChange={(e) => setFormData({ ...formData, quiet_hours_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">Tyst tid slut</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={formData.quiet_hours_end}
                    onChange={(e) => setFormData({ ...formData, quiet_hours_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="is-active" className="cursor-pointer">Aktiverad</Label>
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} disabled={isCreating}>
                  {editingId ? "Uppdatera" : "Lägg till"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Avbryt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
