import { useState, useEffect, useRef } from "react";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { Webhook, WebhookEvent } from "@/types";

export const useWebhooks = () => {
  const [data, setData] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls during StrictMode double render
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    axiosClient
      .get<ApiResponse<Webhook[]>>("/webhooks")
      .then((res) => {
        // Map API response to handle both active and is_active fields
        const webhooks = res.data.results.map((webhook: any) => ({
          ...webhook,
          active: webhook.is_active ?? webhook.active ?? false,
        }));
        setData(webhooks);
        setLoading(false);
        isFetchingRef.current = false;
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch webhooks");
        setLoading(false);
        isFetchingRef.current = false;
      });
  }, []);

  const refetch = () => {
    setLoading(true);
    axiosClient
      .get<ApiResponse<Webhook[]>>("/webhooks")
      .then((res) => {
        // Map API response to handle both active and is_active fields
        const webhooks = res.data.results.map((webhook: any) => ({
          ...webhook,
          active: webhook.is_active ?? webhook.active ?? false,
        }));
        setData(webhooks);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch webhooks");
        setLoading(false);
      });
  };

  return { data, loading, error, refetch };
};

export const useWebhookEvents = () => {
  const [data, setData] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls during StrictMode double render
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    axiosClient
      .get<ApiResponse<WebhookEvent[]>>("/webhooks/events")
      .then((res) => {
        setData(res.data.results);
        setLoading(false);
        isFetchingRef.current = false;
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch webhook events");
        setLoading(false);
        isFetchingRef.current = false;
      });
  }, []);

  return { data, loading, error };
};

