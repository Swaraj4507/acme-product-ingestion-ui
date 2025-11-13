import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WebhookTestResult } from "@/types";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface WebhookTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: WebhookTestResult | null;
  loading: boolean;
}

export const WebhookTestDialog = ({
  open,
  onOpenChange,
  result,
  loading,
}: WebhookTestDialogProps) => {
  const isSuccess = result && result.status_code >= 200 && result.status_code < 300;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Webhook Test Results</DialogTitle>
          <DialogDescription>Response from the webhook endpoint</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                Status: {result.status_code} {isSuccess ? "Success" : "Failed"}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="font-mono">{result.response_time}ms</p>
            </div>
            {result.response_body && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Response Body</p>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40">
                  {result.response_body}
                </pre>
              </div>
            )}
            {result.error && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Error</p>
                <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No test results available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

