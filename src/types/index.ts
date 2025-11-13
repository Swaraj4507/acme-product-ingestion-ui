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
  status_code: number;
  response_time: number;
  response_body?: string;
  error?: string;
}

export interface TaskStatus {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  message?: string;
}

