import { useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { Upload, CheckCircle2, XCircle, Loader2, Clock, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LatestUploadProps {
  onShowHistory?: () => void;
}

export const LatestUpload = ({ onShowHistory }: LatestUploadProps) => {
  // Initial fetch without auto-refresh
  const { data, loading, refetch } = useTasks({
    page: 1,
    limit: 1,
    task_type: "product_ingestion", // Only show product ingestion tasks
    autoRefresh: false, // Start without auto-refresh
  });

  const latestTask = data?.items?.[0];
  
  // Determine if we should poll based on task status
  const shouldPoll = latestTask && 
    (latestTask.status === "processing" ||  
     latestTask.status === "pending");

  // Conditionally poll when task is active
  useEffect(() => {
    if (!shouldPoll) return;

    const interval = setInterval(() => {
      refetch();
    }, 3000); // 3 seconds for active tasks

    return () => clearInterval(interval);
  }, [shouldPoll, refetch]);

  // Listen for upload task completion events to refresh
  useEffect(() => {
    const handleUploadComplete = () => {
      // Small delay to ensure task status is updated on server
      setTimeout(() => {
        refetch();
      }, 500);
    };

    window.addEventListener('uploadTaskCompleted', handleUploadComplete);
    return () => {
      window.removeEventListener('uploadTaskCompleted', handleUploadComplete);
    };
  }, [refetch]);

  if (loading && !latestTask) {
    return null;
  }

  if (!latestTask) {
    return null;
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "processing":
      case "in_progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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

  const isActive = latestTask.status === "processing" || latestTask.status === "in_progress" || latestTask.status === "pending";

  return (
    <Card className={isActive ? "border-blue-500" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              Latest Upload
            </CardTitle>
            <CardDescription>
              {isActive ? "Currently processing in background" : "Last upload status"}
            </CardDescription>
          </div>
          {onShowHistory && (
            <Button variant="outline" size="sm" onClick={onShowHistory}>
              <History className="h-4 w-4 mr-2" />
              Show All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getStatusIcon(latestTask.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium truncate">{latestTask.filename}</p>
                {getStatusBadge(latestTask.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(latestTask.created_at)}
              </p>
            </div>
          </div>
        </div>

        {(latestTask.status === "processing" || latestTask.status === "in_progress") && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {latestTask.processed_records.toLocaleString()} of {latestTask.total_records.toLocaleString()} records
              </span>
              <span className="font-medium">{latestTask.progress.toFixed(1)}%</span>
            </div>
            <Progress value={latestTask.progress} />
          </div>
        )}

        {latestTask.status === "completed" && (
          <div className="text-sm text-green-600 dark:text-green-400">
            ✓ Successfully processed {latestTask.processed_records.toLocaleString()} records
          </div>
        )}

        {latestTask.status === "failed" && (
          <div className="text-sm text-red-600 dark:text-red-400">
            ✗ Upload failed. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

