import { useState, useEffect, useCallback } from "react";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { PaginatedProducts, ApiPaginatedProducts } from "@/types";

interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export const useProducts = (params: UseProductsParams = {}) => {
  const { page = 1, limit = 10, search, active } = params;
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) queryParams.append("search", search);
    if (active !== undefined) queryParams.append("active", active.toString());

    try {
      const res = await axiosClient.get<ApiResponse<ApiPaginatedProducts>>(
        `/products?${queryParams.toString()}`
      );
      
      console.log("Products API Response:", res.data);
      const responseData = res.data.results;
      
      // Map API response to internal format
      const totalPages = Math.ceil(responseData.total / responseData.limit);
      setData({
        items: responseData.data || [],
        total: responseData.total,
        page: responseData.page,
        limit: responseData.limit,
        totalPages: totalPages,
      });
    } catch (err: any) {
      console.error("Products API Error:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, active]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, loading, error, refetch };
};

