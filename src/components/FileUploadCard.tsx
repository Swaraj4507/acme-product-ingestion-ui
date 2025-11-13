import { useState, useRef } from "react";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadStatus } from "@/hooks/useUploadStatus";
import { Upload, File } from "lucide-react";
import { toast } from "sonner";

export const FileUploadCard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { status } = useUploadStatus(taskId);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setTaskId(null);

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosClient.post<ApiResponse<{ task_id: string }>>(
        "/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              const progress = Math.round((e.loaded * 100) / e.total);
              setUploadProgress(progress);
            }
          },
        }
      );

      setTaskId(data.results.task_id);
      toast.success("File uploaded successfully. Processing...");
    } catch (error: any) {
      setIsUploading(false);
      const errorMessage = error.response?.data?.message || "Upload failed";
      toast.error(errorMessage, {
        action: {
          label: "Retry",
          onClick: () => file && handleUpload(file),
        },
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const currentProgress = status?.progress_percentage ?? uploadProgress;
  const currentStatus = status?.status || (isUploading ? "in_progress" : "pending");

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-8 sm:p-12 text-center hover:border-primary transition-colors bg-muted/30"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
        <File className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
        <p className="text-sm text-muted-foreground mb-4">
          or click the button below to browse
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || currentStatus === "in_progress"}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select File
        </Button>
      </div>

      {(isUploading || taskId) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {currentStatus === "in_progress"
                ? "Processing CSV..."
                : currentStatus === "completed"
                ? "Import Complete"
                : currentStatus === "failed"
                ? "Import Failed"
                : "Uploading..."}
            </span>
            <span>{currentProgress.toFixed(1)}%</span>
          </div>
          <Progress value={currentProgress} />
          {status && (
            <div className="text-sm text-muted-foreground">
              <p>
                Processed: {status.processed_records.toLocaleString()} of {status.total_records.toLocaleString()} records
              </p>
            </div>
          )}
        </div>
      )}

      {currentStatus === "completed" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400">
            ✓ Import completed successfully!
          </p>
        </div>
      )}

      {currentStatus === "failed" && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">
            ✗ Import failed. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setTaskId(null);
              setIsUploading(false);
              setUploadProgress(0);
            }}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

