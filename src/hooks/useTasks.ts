import { useState, useEffect, useCallback, useRef } from "react";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { PaginatedTasks, ApiPaginatedTasks } from "@/types";

interface UseTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enabled?: boolean; // Only fetch when enabled is true
}

export const useTasks = (params: UseTasksParams = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    status,
    autoRefresh = false,
    refreshInterval = 15000, // 15 seconds default
    enabled = true // Default to true for backward compatibility
  } = params;
  
  const [data, setData] = useState<PaginatedTasks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const lastParamsRef = useRef<string>("");

  const fetchTasks = useCallback(async () => {
    if (!enabled) return;

    // Create a key from params to detect actual changes
    const paramsKey = `${page}-${limit}-${status || ''}-${enabled}`;
    
    // Prevent duplicate calls during StrictMode double render
    if (isFetchingRef.current && lastParamsRef.current === paramsKey) {
      return;
    }

    isFetchingRef.current = true;
    lastParamsRef.current = paramsKey;
    setLoading(true);
    setError(null);
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) queryParams.append("status", status);

    try {
      const res = await axiosClient.get<ApiResponse<ApiPaginatedTasks>>(
        `/tasks?${queryParams.toString()}`
      );
      
      const responseData = res.data.results;
      const totalPages = Math.ceil(responseData.total / responseData.limit);
      
      setData({
        items: responseData.data || [],
        total: responseData.total,
        page: responseData.page,
        limit: responseData.limit,
        totalPages: totalPages,
      });
    } catch (err: any) {
      console.error("Tasks API Error:", err);
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, limit, status, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [fetchTasks, enabled]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTasks();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTasks]);

  return { data, loading, error, refetch: fetchTasks };
};

