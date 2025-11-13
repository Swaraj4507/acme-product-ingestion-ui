import { useState, useRef } from "react";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { Button } from "@/components/ui/button";
import { TaskProgressDialog } from "@/components/TaskProgressDialog";
import { Upload, File } from "lucide-react";
import { toast } from "sonner";

export const FileUploadCard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setIsUploading(false);
      setShowProgressDialog(true);
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

  const handleUploadComplete = () => {
    // Don't reset taskId here - we need it to check on close
  };

  const handleDialogClose = (open: boolean) => {
    setShowProgressDialog(open);
    
    // If dialog is being closed and we had a task running, trigger refresh
    // This ensures the latest upload card is updated after upload completes
    if (!open && taskId) {
      // Reset taskId when dialog closes
      setTaskId(null);
      // Trigger a custom event that LatestUpload can listen to
      window.dispatchEvent(new CustomEvent('uploadTaskCompleted'));
    }
  };

  return (
    <>
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
            disabled={isUploading || showProgressDialog}
          >
            <Upload className="mr-2 h-4 w-4" />
            Select File
          </Button>
        </div>

        {isUploading && (
          <div className="text-center text-sm text-muted-foreground">
            Uploading file... {uploadProgress > 0 && `${uploadProgress}%`}
          </div>
        )}
      </div>

      <TaskProgressDialog
        open={showProgressDialog}
        onOpenChange={handleDialogClose}
        taskId={taskId}
        title="File Upload Progress"
        description="Processing your CSV file. This may take a few moments."
        icon={Upload}
        recordLabel="records"
        startingMessage="Starting file processing..."
        processingMessage="Processing CSV file..."
        completedMessage="File import completed successfully"
        failedMessage="File import failed"
        onComplete={handleUploadComplete}
      />
    </>
  );
};

