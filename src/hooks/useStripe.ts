'use client';

import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UseStripeResult {
  loading: boolean;
  createCheckoutSession: (slotId: string) => Promise<void>;
  redirectToCheckout: (sessionId: string) => Promise<void>;
}

export function useStripe(): UseStripeResult {
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = useCallback(async (slotId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slotId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      await redirectToCheckout(sessionId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  }, []);

  const redirectToCheckout = useCallback(async (sessionId: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to redirect to checkout');
    }
  }, []);

  return {
    loading,
    createCheckoutSession,
    redirectToCheckout,
  };
}

interface UseStripeConnectResult {
  loading: boolean;
  onboardCoach: () => Promise<void>;
  getOnboardingStatus: () => Promise<any>;
}

export function useStripeConnect(): UseStripeConnectResult {
  const [loading, setLoading] = useState(false);

  const onboardCoach = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/payments/connect/onboard', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start onboarding');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to start Stripe onboarding');
    } finally {
      setLoading(false);
    }
  }, []);

  const getOnboardingStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/payments/connect/status');
      if (!response.ok) {
        throw new Error('Failed to get onboarding status');
      }
      return response.json();
    } catch (error: any) {
      console.error('Failed to get onboarding status:', error);
      return null;
    }
  }, []);

  return {
    loading,
    onboardCoach,
    getOnboardingStatus,
  };
}
