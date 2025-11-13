import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { History, RefreshCw, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskHistoryDialog = ({ open, onOpenChange }: TaskHistoryDialogProps) => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, loading, error, refetch } = useTasks({
    page,
    limit,
    autoRefresh: open, // Only auto-refresh when dialog is open
    refreshInterval: 15000,
  });

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
      case "in_progress":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Task["status"]) => {
    const variants: Record<string, string> = {
      completed: "bg-green-500 hover:bg-green-600 text-white",
      failed: "bg-red-500 hover:bg-red-600 text-white",
      processing: "bg-blue-500 hover:bg-blue-600 text-white",
      in_progress: "bg-blue-500 hover:bg-blue-600 text-white",
      pending: "bg-gray-500 hover:bg-gray-600 text-white",
    };

    return (
      <Badge className={variants[status] || "bg-gray-500 hover:bg-gray-600 text-white"}>
        {status === "in_progress" ? "Processing" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const tasks = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Task History
              </DialogTitle>
              <DialogDescription className="mt-1">
                All uploads and bulk operations (auto-refreshes every 15s)
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {loading && !data && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive p-4">{error}</div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found</p>
            </div>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{task.filename}</p>
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(task.created_at)}
                      {task.completed_at && task.status === "completed" && (
                        <span className="ml-2">
                          • Completed {formatDate(task.completed_at)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {(task.status === "processing" || task.status === "in_progress") && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {task.processed_records.toLocaleString()} of {task.total_records.toLocaleString()} records
                    </span>
                    <span className="font-medium">{task.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={task.progress} />
                </div>
              )}

              {task.status === "completed" && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  ✓ Completed: {task.processed_records.toLocaleString()} records processed
                </div>
              )}

              {task.status === "failed" && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  ✗ Failed to process
                </div>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

