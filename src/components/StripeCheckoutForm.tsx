'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Lock, AlertCircle } from 'lucide-react';

// Lazy load Stripe to ensure env vars are available
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
};

interface StripeCheckoutFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

function CheckoutForm({ onSuccess, onBack, amount }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'An error occurred during payment.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment was not successful. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-olive-500">
        <Lock className="w-4 h-4" />
        Your payment information is encrypted and secure
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-4 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-70"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </motion.button>
      </div>
    </form>
  );
}

export default function StripeCheckoutForm({ amount, onSuccess, onBack }: StripeCheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (amount <= 0) return;

    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize payment. Please try again.');
      });
  }, [amount]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
        <p className="text-olive-600 text-center">
          Please check that your Stripe API keys are configured in the environment variables.
        </p>
        <button
          onClick={onBack}
          className="w-full py-4 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
        >
          Back to Shipping
        </button>
      </div>
    );
  }

  // Check if Stripe key is configured
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-700 rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Stripe is not configured. Please add your API keys to .env.local</p>
        </div>
        <button
          onClick={onBack}
          className="w-full py-4 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
        >
          Back to Shipping
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mb-4"></div>
        <p className="text-olive-600">Initializing secure payment...</p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#b8860b',
        colorBackground: '#ffffff',
        colorText: '#3d4a2d',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          border: '1px solid #d4d4aa',
          boxShadow: 'none',
          padding: '12px 16px',
        },
        '.Input:focus': {
          border: '1px solid #b8860b',
          boxShadow: '0 0 0 2px rgba(184, 134, 11, 0.2)',
        },
        '.Label': {
          fontWeight: '500',
          color: '#3d4a2d',
          marginBottom: '8px',
        },
        '.Tab': {
          border: '1px solid #d4d4aa',
          borderRadius: '12px',
        },
        '.Tab--selected': {
          border: '2px solid #b8860b',
          backgroundColor: '#fdf8f0',
        },
      },
    },
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  );
}
