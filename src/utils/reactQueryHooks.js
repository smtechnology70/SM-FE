import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// Generic fetcher for GET requests
export const fetcher = async ({ queryKey }) => {
  const [url, params] = queryKey;
  const response = await apiClient.get(url, { params });
  return response.data;
};

// Generic mutation for POST/PUT/DELETE
export const useApiMutation = (method, url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient[method](url, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// Generic hook for GET requests
export const useApiQuery = ({ url, params, interval = false, ...options }) => {
  return useQuery({
    queryKey: [url, params],
    queryFn: fetcher,
    refetchInterval: interval,
    retry: 2,
    ...options,
  });
};
