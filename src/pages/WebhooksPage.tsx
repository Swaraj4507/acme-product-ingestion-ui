import { useState } from "react";
import { useWebhooks, useWebhookEvents } from "@/hooks/useWebhooks";
import { WebhookTable } from "@/components/WebhookTable";
import { WebhookFormModal } from "@/components/WebhookFormModal";
import { WebhookTestDialog } from "@/components/WebhookTestDialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Webhook, WebhookTestResult } from "@/types";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const WebhooksPage = () => {
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteWebhook, setDeleteWebhook] = useState<Webhook | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<Webhook | null>(null);
  const [testResult, setTestResult] = useState<WebhookTestResult | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const { data: webhooks, loading, error, refetch } = useWebhooks();
  const { data: events } = useWebhookEvents();

  const handleCreate = async (webhookData: any) => {
    try {
      // Ensure we send the correct API format
      const payload = {
        name: webhookData.name,
        url: webhookData.url,
        event_type: webhookData.event_type,
        is_active: webhookData.is_active ?? true,
      };
      await axiosClient.post<ApiResponse<Webhook>>("/webhooks", payload);
      toast.success("Webhook created successfully");
      refetch();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail?.[0]?.msg || 
                       error.response?.data?.message || 
                       "Failed to create webhook";
      toast.error(errorMsg);
      throw error;
    }
  };

  const handleUpdate = async (webhookData: any) => {
    if (!editingWebhook) return;
    try {
      // Ensure we send the correct API format
      const payload = {
        name: webhookData.name,
        url: webhookData.url,
        event_type: webhookData.event_type,
        is_active: webhookData.is_active ?? true,
      };
      await axiosClient.put<ApiResponse<Webhook>>(`/webhooks/${editingWebhook.id}`, payload);
      toast.success("Webhook updated successfully");
      refetch();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail?.[0]?.msg || 
                       error.response?.data?.message || 
                       "Failed to update webhook";
      toast.error(errorMsg);
      throw error;
    }
  };

  const handleDelete = async (webhook: Webhook) => {
    try {
      await axiosClient.delete(`/webhooks/${webhook.id}`);
      toast.success("Webhook deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete webhook");
    }
  };

  const handleToggleActive = async (webhook: Webhook, active: boolean) => {
    try {
      await axiosClient.put<ApiResponse<Webhook>>(`/webhooks/${webhook.id}`, {
        name: webhook.name,
        url: webhook.url,
        event_type: webhook.event_type,
        is_active: active,
      });
      toast.success(`Webhook ${active ? "activated" : "deactivated"}`);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update webhook");
      refetch(); // Revert the UI change
    }
  };

  const handleTest = async (webhook: Webhook) => {
    setTestingWebhook(webhook);
    setIsTestLoading(true);
    setIsTestDialogOpen(true);
    setTestResult(null);

    try {
      const { data } = await axiosClient.post<ApiResponse<WebhookTestResult>>(
        `/webhooks/${webhook.id}/test`
      );
      setTestResult(data.results);
    } catch (error: any) {
      setTestResult({
        status_code: error.response?.status || 0,
        response_time: 0,
        error: error.response?.data?.message || "Failed to test webhook",
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <Button
          onClick={() => {
            setEditingWebhook(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <WebhookTable
        webhooks={webhooks}
        onEdit={(webhook) => {
          setEditingWebhook(webhook);
          setIsFormOpen(true);
        }}
        onDelete={setDeleteWebhook}
        onTest={handleTest}
        onToggleActive={handleToggleActive}
        loading={loading}
      />

      <WebhookFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        webhook={editingWebhook}
        events={events || []}
        onSubmit={editingWebhook ? handleUpdate : handleCreate}
      />

      <WebhookTestDialog
        open={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        result={testResult}
        loading={isTestLoading}
      />

      <AlertDialog
        open={!!deleteWebhook}
        onOpenChange={(open) => !open && setDeleteWebhook(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this webhook? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteWebhook) {
                  handleDelete(deleteWebhook);
                  setDeleteWebhook(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

