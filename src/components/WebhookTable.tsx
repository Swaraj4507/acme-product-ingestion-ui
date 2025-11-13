import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Webhook } from "@/types";
import { Edit, Trash2 } from "lucide-react";

interface WebhookTableProps {
  webhooks: Webhook[];
  onEdit: (webhook: Webhook) => void;
  onDelete: (webhook: Webhook) => void;
  onTest: (webhook: Webhook) => void;
  onToggleActive: (webhook: Webhook, active: boolean) => void;
  loading?: boolean;
}

export const WebhookTable = ({
  webhooks,
  onEdit,
  onDelete,
  onTest,
  onToggleActive,
  loading,
}: WebhookTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading webhooks...</div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No webhooks configured</div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell className="font-medium">{webhook.name || "-"}</TableCell>
              <TableCell className="font-mono text-sm">{webhook.url}</TableCell>
              <TableCell>{webhook.event_type}</TableCell>
              <TableCell>
                <Switch
                  checked={webhook.is_active ?? webhook.active ?? false}
                  onCheckedChange={(checked) => onToggleActive(webhook, checked)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTest(webhook)}
                  >
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(webhook)}
                    title="Edit webhook"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(webhook)}
                    title="Delete webhook"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

