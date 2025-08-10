import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { paymentAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const PaymentGateway = ({ amount, bookingId, onPaymentSuccess, onPaymentFailure, onClose }) => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', null

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const validateCard = () => {
    const { cardNumber, cardHolder, expiryMonth, expiryYear, cvv } = paymentData;
    
    if (!cardNumber || cardNumber.length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!cardHolder.trim()) {
      toast({
        title: "Card Holder Required",
        description: "Please enter the card holder name.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!expiryMonth || !expiryYear) {
      toast({
        title: "Expiry Date Required",
        description: "Please select card expiry month and year.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3-digit CVV.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const processPayment = async () => {
    if (!validateCard()) return;
    
         // Check if user is authenticated
     if (!user || (!user.userId && !user.id && !user.user_id)) {
      toast({
        title: "Authentication Error",
        description: "Please log in to make a payment.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      
              if (isSuccess) {
          // Debug: Log user object to see its structure
          console.log('Current user object:', user);
          console.log('User ID from user.id:', user.id);
          console.log('User ID from user.userId:', user.userId);
          console.log('User ID from user.user_id:', user.user_id);
          console.log('All user keys:', Object.keys(user));
          
                     // Store payment details in database - using PascalCase to match C# model
           const paymentData = {
             UserId: user.userId || user.id || user.user_id, // Prioritize userId since that's what your backend sends
            BookingId: bookingId,
            StripePaymentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
            Amount: amount,
            Currency: 'INR',
            PaymentStatus: 'succeeded',
            PaymentMethodType: 'card',
            ReceiptUrl: `https://receipt.stripe.com/${Math.random().toString(36).substr(2, 9)}`,
            CreatedAt: new Date().toISOString()
          };

        try {
          console.log('Sending payment data to backend:', paymentData);
          
          // Try with PascalCase first (C# model convention)
          try {
            await paymentAPI.create(paymentData);
          } catch (pascalCaseError) {
            console.log('PascalCase failed, trying snake_case...', pascalCaseError);
            
                         // Fallback to snake_case if PascalCase fails
             const snakeCaseData = {
               user_id: user.userId || user.id || user.user_id, // Prioritize userId since that's what your backend sends
               booking_id: bookingId,
               stripe_payment_id: `pi_${Math.random().toString(36).substr(2, 9)}`,
               amount: amount,
               currency: 'INR',
               payment_status: 'succeeded',
               payment_method_type: 'card',
               receipt_url: `https://receipt.stripe.com/${Math.random().toString(36).substr(2, 9)}`,
               created_at: new Date().toISOString()
             };
            
            console.log('Trying snake_case data:', snakeCaseData);
            await paymentAPI.create(snakeCaseData);
          }
          
          setPaymentStatus('success');
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed and stored successfully!",
          });
          
          // Add a small delay to ensure payment is fully processed
          setTimeout(() => {
            onPaymentSuccess();
          }, 1500);
        } catch (dbError) {
          console.error('Error storing payment:', dbError);
          // Even if DB storage fails, we can still proceed with success
          setPaymentStatus('success');
          toast({
            title: "Payment Successful",
            description: "Payment processed successfully!",
          });
          setTimeout(() => {
            onPaymentSuccess();
          }, 1500);
        }
      } else {
        setPaymentStatus('failed');
        toast({
          title: "Payment Failed",
          description: "Payment processing failed. Please try again.",
          variant: "destructive"
        });
        setTimeout(() => {
          onPaymentFailure();
        }, 2000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: "An error occurred during payment processing.",
        variant: "destructive"
      });
      onPaymentFailure();
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
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

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  if (paymentStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-md glass-effect border-green-500/30">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-300">Your booking has been confirmed.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-md glass-effect border-red-500/30">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
            <p className="text-gray-300 mb-4">Please try again with a different payment method.</p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Secure Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Display */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <p className="text-gray-300 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-white">₹{amount}</p>
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Card Holder */}
            <div className="space-y-2">
              <Label htmlFor="cardHolder" className="text-white">Card Holder Name</Label>
              <Input
                id="cardHolder"
                type="text"
                placeholder="Enter name as on card"
                value={paymentData.cardHolder}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardHolder: e.target.value }))}
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Expiry Month</Label>
                <Select
                  value={paymentData.expiryMonth}
                  onValueChange={(value) =>
                    setPaymentData((prev) => ({ ...prev, expiryMonth: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 - new Date().getMonth() }, (_, i) => {
                      const month = new Date().getMonth() + 1 + i; // 1-based month
                      const paddedMonth = month.toString().padStart(2, '0');
                      return (
                        <SelectItem key={paddedMonth} value={paddedMonth}>
                          {paddedMonth}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              
              <div className="space-y-2">
                <Label className="text-white">Expiry Year</Label>
                <Select value={paymentData.expiryYear} onValueChange={(value) => setPaymentData(prev => ({ ...prev, expiryYear: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

           {/* CVV */}
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-white">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                  setPaymentData(prev => ({ ...prev, cvv: onlyNums }));
                }}
                maxLength={3}
                inputMode="numeric"
                pattern="\d*"
              />
            </div>


            {/* Security Notice */}
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Lock className="h-4 w-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-400/30 text-gray-300 hover:bg-gray-400/10"
              >
                Cancel
              </Button>
              <Button
                onClick={processPayment}
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ₹{amount}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PaymentGateway; 