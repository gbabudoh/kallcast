'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  refetch: () => Promise<T | null>;
}

export function useApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { immediate = false, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(err);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate && !hasExecuted) {
      setHasExecuted(true);
      execute();
    }
  }, [immediate, hasExecuted, execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  };
}

// Specific API hooks
export function useCoaches() {
  return useApi(async () => {
    const response = await fetch('/api/coaches', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch coaches');
    return response.json();
  }, { immediate: true, onError: () => {} });
}

export function useCoach(coachId: string) {
  return useApi(async () => {
    const response = await fetch(`/api/coaches/${coachId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch coach');
    return response.json();
  }, { immediate: true, onError: () => {} });
}

export function useSlots(coachId?: string) {
  return useApi(async () => {
    const url = coachId ? `/api/slots?coachId=${coachId}` : '/api/slots';
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch slots');
    return response.json();
  }, { immediate: true, onError: () => {} });
}

export function useBookings(userId?: string) {
  return useApi(async () => {
    const url = userId ? `/api/bookings?userId=${userId}` : '/api/bookings';
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  }, { immediate: true, onError: () => {} });
}

export function useReviews(coachId?: string) {
  return useApi(async () => {
    const url = coachId ? `/api/reviews?coachId=${coachId}` : '/api/reviews';
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }, { immediate: true, onError: () => {} });
}

export function useUserProfile(userId: string) {
  return useApi(async () => {
    if (!userId) return null;
    const response = await fetch(`/api/users/${userId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }, { immediate: !!userId, onError: () => {} });
}
