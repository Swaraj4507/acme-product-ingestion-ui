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
  const isSuccess = result?.success ?? false;

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
                {isSuccess ? "Test Successful" : "Test Failed"}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status Code</p>
              <p className="font-mono text-sm">{result.status_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="font-mono text-sm">{result.response_time_ms.toFixed(2)}ms</p>
            </div>
            {result.timestamp && (
              <div>
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <p className="font-mono text-xs">{new Date(result.timestamp).toLocaleString()}</p>
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

