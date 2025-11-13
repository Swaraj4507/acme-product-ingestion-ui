import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Webhook, WebhookEvent } from "@/types";

interface WebhookFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhook?: Webhook | null;
  events: WebhookEvent[];
  onSubmit: (data: Omit<Webhook, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

export const WebhookFormModal = ({
  open,
  onOpenChange,
  webhook,
  events,
  onSubmit,
}: WebhookFormModalProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      url: "",
      event_type: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const eventType = watch("event_type");

  useEffect(() => {
    if (webhook) {
      reset({
        name: webhook.name || "",
        url: webhook.url,
        event_type: webhook.event_type,
        is_active: webhook.is_active ?? webhook.active ?? true,
      });
    } else {
      reset({
        name: "",
        url: "",
        event_type: "",
        is_active: true,
      });
    }
  }, [webhook, reset]);

  const onFormSubmit = async (data: any) => {
    try {
      // Transform to API format
      const apiData = {
        name: data.name,
        url: data.url,
        event_type: data.event_type,
        is_active: data.is_active,
      };
      await onSubmit(apiData as any);
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{webhook ? "Edit Webhook" : "Create Webhook"}</DialogTitle>
          <DialogDescription>
            {webhook
              ? "Update the webhook configuration below."
              : "Configure a new webhook to receive events."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Webhook Name *</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="My Webhook"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Webhook URL *</Label>
            <Input
              id="url"
              type="url"
              {...register("url", { required: true })}
              placeholder="https://example.com/webhook"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type *</Label>
            <Select value={eventType} onValueChange={(value) => setValue("event_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event type" />
              </SelectTrigger>
              <SelectContent>
                {events.length === 0 ? (
                  <SelectItem value="" disabled>No events available</SelectItem>
                ) : (
                  events.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{webhook ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

