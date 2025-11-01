'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStripe } from '@/hooks';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TimeSlot } from '@/types/slot';
import { toast } from 'sonner';

interface PaymentFormProps {
  selectedSlot: TimeSlot;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentForm({ 
  selectedSlot, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const { loading: isProcessing, createCheckoutSession } = useStripe();

  const platformFee = Math.round(selectedSlot.price * 0.20); // 20% platform fee
  const total = selectedSlot.price;

  const handlePayment = async () => {
    if (!selectedSlot) {
      onPaymentError('No slot selected');
      return;
    }

    try {
      await createCheckoutSession(selectedSlot.id);
      onPaymentSuccess('Payment initiated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onPaymentError(errorMessage);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Details</span>
        </CardTitle>
        <CardDescription>
          Complete your booking with secure payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              className="justify-start h-auto p-4"
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Credit or Debit Card</div>
                  <div className="text-sm text-muted-foreground">
                    Visa, Mastercard, American Express
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ 
                  ...prev, 
                  number: formatCardNumber(e.target.value) 
                }))}
                disabled={isProcessing}
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ 
                    ...prev, 
                    expiry: formatExpiry(e.target.value) 
                  }))}
                  disabled={isProcessing}
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="Enter CVV"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails(prev => ({ 
                    ...prev, 
                    cvc: e.target.value.replace(/\D/g, '') 
                  }))}
                  disabled={isProcessing}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="space-y-4">
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Session fee</span>
              <span>${selectedSlot.price}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Platform fee (20%)</span>
              <span>${platformFee}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>
                Your payment is processed securely by Stripe. We never store your card details.
                You can cancel up to 24 hours before your session for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pay ${total} - Book Session
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By booking this session, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}
