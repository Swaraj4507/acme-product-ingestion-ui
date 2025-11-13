import { useState } from "react";
import { FileUploadCard } from "@/components/FileUploadCard";
import { LatestUpload } from "@/components/LatestUpload";
import { TaskHistoryDialog } from "@/components/TaskHistoryDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export const UploadPage = () => {
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 mb-2">
          <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
          Upload Products
        </h1>
        <p className="text-muted-foreground">
          Upload CSV files to import products in bulk. Supports up to 500,000 products per file.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Drag and drop your CSV file or click to browse. Duplicate SKUs will be automatically overwritten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadCard />
        </CardContent>
      </Card>

      <LatestUpload onShowHistory={() => setIsHistoryDialogOpen(true)} />

      <TaskHistoryDialog
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
      />
    </div>
  );
};

