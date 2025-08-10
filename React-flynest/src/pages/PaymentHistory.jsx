import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Search,
  Receipt,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { paymentAPI, bookingAPI } from '@/services/api';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
                    // Check if user is authenticated
       const userId = user?.userId || user?.id || user?.user_id; // Prioritize userId since that's what your backend sends
       if (!user || !userId) {
         toast({
           title: "Authentication Error",
           description: "Please log in to view your payment history.",
           variant: "destructive"
         });
         return;
       }

       console.log('Fetching payments for user:', userId);
       console.log('User object:', user);
       
       // Try multiple endpoints to get user payments
       let response;
       let userPayments = [];
       
       try {
         // Try the primary endpoint first
         response = await paymentAPI.getByUser(userId);
         userPayments = response.data || [];
         console.log('Primary endpoint successful:', userPayments);
       } catch (primaryError) {
         console.log('Primary endpoint failed, trying fallback...', primaryError);
         
         try {
           // Try fallback endpoint
           response = await paymentAPI.getByUserFallback(userId);
           userPayments = response.data || [];
           console.log('Fallback endpoint successful:', userPayments);
         } catch (fallbackError) {
           console.log('Fallback endpoint failed, trying alternative...', fallbackError);
           
           try {
             // Try alternative endpoint
             response = await paymentAPI.getByUserAlternative(userId);
             userPayments = response.data || [];
             console.log('Alternative endpoint successful:', userPayments);
           } catch (alternativeError) {
             console.log('All endpoints failed, getting all payments and filtering...', alternativeError);
             
             // Last resort: get all payments and filter by user
             const allPaymentsResponse = await paymentAPI.getAll();
             const allPayments = allPaymentsResponse.data || [];
             
             // Filter payments by user ID
             userPayments = allPayments.filter(payment => 
               payment.userId === userId || 
               payment.user_id === userId || 
               payment.UserId === userId
             );
             console.log('Filtered payments from all payments:', userPayments);
           }
         }
       }
             console.log('User payments response:', response);
      console.log('User payments:', userPayments);
      
             // Map database column names to expected property names
       const mappedPayments = userPayments.map(payment => ({
         paymentId: payment.payment_id || payment.PaymentId || payment.paymentId,
         bookingId: payment.booking_id || payment.BookingId || payment.bookingId,
         stripePaymentId: payment.stripe_payment_id || payment.StripePaymentId || payment.stripePaymentId,
         amount: payment.amount || payment.Amount,
         currency: payment.currency || payment.Currency,
         paymentStatus: payment.payment_status || payment.PaymentStatus || payment.paymentStatus,
         paymentMethodType: payment.payment_method_type || payment.PaymentMethodType || payment.paymentMethodType,
         receiptUrl: payment.receipt_url || payment.ReceiptUrl || payment.receiptUrl,
         createdAt: payment.created_at || payment.CreatedAt || payment.createdAt
       }));
      
      console.log('Mapped user payments:', mappedPayments);
      
      setPayments(mappedPayments);
      
      // Check if there are recent payments (within last 5 minutes) to show welcome message
      const recentPayments = mappedPayments.filter(payment => {
        const paymentTime = new Date(payment.createdAt);
        const now = new Date();
        const diffInMinutes = (now - paymentTime) / (1000 * 60);
        return diffInMinutes < 5;
      });
      
      if (recentPayments.length > 0) {
        setShowWelcomeMessage(true);
        setTimeout(() => setShowWelcomeMessage(false), 5000); // Hide after 5 seconds
      }
      
    } catch (error) {
      console.error('Error fetching payments:', error);
      
      // More specific error messages
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to view your payment history.",
          variant: "destructive"
        });
      } else if (error.response?.status === 404) {
        toast({
          title: "No Payments Found",
          description: "No payment history found for your account.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load payment history. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.stripePaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.bookingId?.toString().includes(searchTerm) ||
        payment.amount?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => 
        payment.paymentStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const downloadReceipt = (payment) => {
    // Create receipt content
    const receiptContent = `
Flynest - Payment Receipt
========================

Payment ID: ${payment.paymentId}
Stripe Payment ID: ${payment.stripePaymentId}
Booking ID: ${payment.bookingId}
Amount: ₹${payment.amount}
Currency: ${payment.currency}
Payment Method: ${payment.paymentMethodType}
Status: ${payment.paymentStatus}
Date: ${formatDate(payment.createdAt)}

Thank you for choosing Flynest!
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${payment.paymentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Payment receipt has been downloaded successfully!",
    });
  };

  const testAPI = async () => {
    try {
      console.log('Testing API connection...');
      
      // Test 1: Check if user is authenticated
      console.log('User:', user);
      console.log('Token:', localStorage.getItem('flynest_token'));
      
             // Test 2: Try to get user-specific payments
       const userId = user?.userId || user?.id || user?.user_id; // Prioritize userId since that's what your backend sends
       const userPaymentsResponse = await paymentAPI.getByUser(userId);
      console.log('User Payments API test:', userPaymentsResponse);
      
      // Test 3: Check payment data structure
      if (userPaymentsResponse.data && userPaymentsResponse.data.length > 0) {
        console.log('First payment structure:', userPaymentsResponse.data[0]);
        console.log('Payment keys:', Object.keys(userPaymentsResponse.data[0]));
      }
      
      // Test 4: Try to get all payments (for comparison)
      const allPaymentsResponse = await paymentAPI.getAll();
      console.log('All Payments API test:', allPaymentsResponse);
      console.log('Total payments in system:', allPaymentsResponse.data?.length || 0);
      console.log('User payments count:', userPaymentsResponse.data?.length || 0);
      
      toast({
        title: "API Test Complete",
        description: "Check console for API test results",
      });
    } catch (error) {
      console.error('API Test Error:', error);
      toast({
        title: "API Test Failed",
        description: error.message || "Check console for details",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-300">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <>
             <Helmet>
         <title>My Payment History - Flynest</title>
         <meta name="description" content="View your personal payment history and transaction details." />
       </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
                     {/* Header */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ duration: 0.8 }}
             className="mb-8"
           >
             <h1 className="text-4xl font-bold text-white mb-2">
               My Payment History
             </h1>
             <p className="text-gray-300">
               View all your payment transactions and receipts, {user?.name || 'Traveler'}
             </p>
           </motion.div>

           {/* Welcome Message for Recent Payments */}
           {showWelcomeMessage && (
             <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="mb-6"
             >
               <Card className="glass-effect border-green-500/30">
                 <CardContent className="p-4">
                   <div className="flex items-center space-x-3">
                     <CheckCircle className="h-6 w-6 text-green-400" />
                     <div>
                       <h3 className="font-semibold text-white">Payment Successful!</h3>
                       <p className="text-gray-300 text-sm">
                         Your payment has been processed and stored. You can download your receipt below.
                       </p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
           )}

          {/* Filters */}
          <Card className="glass-effect border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                                 <Button
                   onClick={fetchPayments}
                   variant="outline"
                   className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                 >
                   <RefreshCw className="mr-2 h-4 w-4" />
                   Refresh
                 </Button>
                 
                                   <Button
                    onClick={testAPI}
                    variant="outline"
                    className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                  >
                    Test API
                  </Button>
                  
                  <Button
                    onClick={() => {
                      console.log('=== USER DEBUG INFO ===');
                      console.log('User object:', user);
                      console.log('User ID (user.id):', user?.id);
                      console.log('User ID (user.userId):', user?.userId);
                      console.log('User ID (user.user_id):', user?.user_id);
                      console.log('All user keys:', Object.keys(user || {}));
                      console.log('Local storage user:', localStorage.getItem('flynest_user'));
                      console.log('Parsed local storage user:', JSON.parse(localStorage.getItem('flynest_user') || '{}'));
                      toast({
                        title: "User Debug Info",
                        description: "Check console for detailed user information",
                      });
                    }}
                    variant="outline"
                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Debug User
                  </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          {filteredPayments.length === 0 ? (
            <Card className="glass-effect border-white/10">
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                 <h3 className="text-xl font-semibold text-white mb-2">No Payments Found</h3>
                 <p className="text-gray-300 mb-6">
                   {searchTerm || statusFilter !== 'all' 
                     ? "No payments match your current filters." 
                     : "You haven't made any payments yet. Start by booking a flight!"}
                 </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => navigate('/flights')}>
                    Search Flights
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPayments.map((payment, index) => (
                <motion.div
                  key={payment.paymentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-white/10 hover:border-white/20 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.paymentStatus)}
                          <Badge className={getStatusColor(payment.paymentStatus)}>
                            {payment.paymentStatus}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Payment ID</p>
                          <p className="font-mono text-white text-sm">{payment.paymentId}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Payment Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <div>
                              <p className="text-sm text-gray-400">Amount</p>
                              <p className="font-bold text-white text-lg">₹{payment.amount}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-blue-400" />
                            <div>
                              <p className="text-sm text-gray-400">Method</p>
                              <p className="font-medium text-white capitalize">
                                {payment.paymentMethodType}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking and Date */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Receipt className="h-4 w-4 text-purple-400" />
                            <div>
                              <p className="text-sm text-gray-400">Booking ID</p>
                              <p className="font-medium text-white">{payment.bookingId}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-yellow-400" />
                            <div>
                              <p className="text-sm text-gray-400">Date</p>
                              <p className="font-medium text-white">
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stripe Payment ID */}
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-400">Stripe Payment ID</p>
                          <p className="font-mono text-white text-sm">{payment.stripePaymentId}</p>
                        </div>
                      </div>

                                             {/* Receipt Actions */}
                       <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2">
                           <Receipt className="h-4 w-4 text-green-400" />
                           <div>
                             <p className="text-sm text-gray-400">Receipt</p>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => downloadReceipt(payment)}
                               className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                             >
                               <Download className="h-3 w-3 mr-1" />
                               Download
                             </Button>
                           </div>
                         </div>
                         
                         {payment.receiptUrl && (
                           <div className="flex items-center space-x-2">
                             <Receipt className="h-4 w-4 text-purple-400" />
                             <div>
                               <p className="text-sm text-gray-400">Online</p>
                               <a 
                                 href={payment.receiptUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-purple-400 hover:text-purple-300 text-sm underline"
                               >
                                 View Online
                               </a>
                             </div>
                           </div>
                         )}
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentHistory; 