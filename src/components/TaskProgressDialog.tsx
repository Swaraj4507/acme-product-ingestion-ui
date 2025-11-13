import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { CheckCircle2, XCircle, Loader2, LucideIcon } from "lucide-react";

interface TaskProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  title: string;
  description: string;
  icon?: LucideIcon;
  recordLabel?: string; // e.g., "products", "records"
  startingMessage?: string;
  processingMessage?: string;
  completedMessage?: string;
  failedMessage?: string;
  onComplete?: () => void;
}

export const TaskProgressDialog = ({
  open,
  onOpenChange,
  taskId,
  title,
  description,
  icon: Icon,
  recordLabel = "items",
  startingMessage,
  processingMessage,
  completedMessage,
  failedMessage,
  onComplete,
}: TaskProgressDialogProps) => {
  const { status, loading } = useTaskStatus(taskId);

  const getStatusIcon = () => {
    if (!status) return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
    
    switch (status.status) {
      case "completed":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case "failed":
        return <XCircle className="h-8 w-8 text-red-500" />;
      case "processing":
      case "in_progress":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      default:
        return <Loader2 className="h-8 w-8 animate-spin text-gray-500" />;
    }
  };

  const getStatusText = () => {
    if (!status) return startingMessage || "Starting...";
    
    switch (status.status) {
      case "completed":
        return completedMessage || "Operation completed successfully";
      case "failed":
        return failedMessage || "Operation failed";
      case "processing":
      case "in_progress":
        return processingMessage || "Processing...";
      default:
        return startingMessage || "Preparing...";
    }
  };

  const isComplete = status?.status === "completed" || status?.status === "failed";
  const isInProgress = status?.status === "processing" || status?.status === "in_progress";

  // Auto-close on completion and call onComplete
  useEffect(() => {
    if (isComplete && status?.status === "completed" && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
        onOpenChange(false);
      }, 2000); // Wait 2 seconds before closing
      return () => clearTimeout(timer);
    }
  }, [isComplete, status?.status, onComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            {getStatusIcon()}
            <p className="text-center font-medium">{getStatusText()}</p>
          </div>

          {isInProgress && status && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {status.processed_records.toLocaleString()} of {status.total_records.toLocaleString()} {recordLabel}
                </span>
                <span className="font-medium">{status.progress.toFixed(1)}%</span>
              </div>
              <Progress value={status.progress} />
            </div>
          )}

          {status?.status === "completed" && (
            <div className="text-center text-sm text-green-600 dark:text-green-400">
              ✓ Successfully processed {status.processed_records.toLocaleString()} {recordLabel}
            </div>
          )}

          {status?.status === "failed" && (
            <div className="text-center text-sm text-red-600 dark:text-red-400">
              ✗ Operation failed. Please try again.
            </div>
          )}

          {isComplete && (
            <div className="flex justify-end pt-4">
              <Button onClick={() => onOpenChange(false)}>
                {status?.status === "completed" ? "Done" : "Close"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

