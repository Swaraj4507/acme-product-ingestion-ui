export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API response structure
export interface ApiPaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface UploadStatus {
  status: "pending" | "in_progress" | "completed" | "failed";
  processed_records: number;
  total_records: number;
  progress_percentage: number;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  event_type: string;
  active: boolean; // For display purposes (API might return is_active)
  is_active?: boolean; // API request/response field
  createdAt?: string;
  updatedAt?: string;
}

export interface WebhookEvent {
  value: string;
  label: string;
}

export interface WebhookTestResult {
  success: boolean;
  status_code: number;
  response_time_ms: number;
  error: string | null;
  timestamp: string;
}

export interface TaskStatus {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed" | "in_progress";
  progress: number;
  processed_records: number;
  total_records: number;
  message?: string;
}

export interface Task {
  id: string;
  task_id: string;
  filename: string;
  status: "pending" | "processing" | "completed" | "failed" | "in_progress";
  processed_records: number;
  total_records: number;
  progress: number;
  created_at: string;
  completed_at: string | null;
}

export interface ApiPaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedTasks {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

