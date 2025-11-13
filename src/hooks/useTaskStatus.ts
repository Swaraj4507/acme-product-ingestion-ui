import { useState, useEffect } from "react";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { TaskStatus } from "@/types";

export const useTaskStatus = (taskId: string | null, enabled: boolean = true) => {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId || !enabled) {
      // Reset status when disabled or no taskId
      if (!enabled) {
        setStatus(null);
        setLoading(false);
      }
      return;
    }

    const interval = setInterval(async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get<ApiResponse<TaskStatus>>(
          `/tasks/${taskId}`
        );
        setStatus(data.results);
        setLoading(false);

        // Stop polling when status is completed or failed
        if (["completed", "failed"].includes(data.results.status)) {
          clearInterval(interval);
        }
      } catch (error) {
        setLoading(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId, enabled]);

  return { status, loading };
};

