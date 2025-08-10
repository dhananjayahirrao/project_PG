import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { adminAPI } from '@/services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting admin login with:', formData);
      const response = await adminAPI.login(formData);
      console.log('Admin login response:', response);
      
      // Store admin token and user info
      localStorage.setItem('flynest_admin_token', response.data.token);
      localStorage.setItem('flynest_admin_user', JSON.stringify(response.data.user));
      
      toast({
        title: "Login Successful",
        description: "Welcome back, Admin!"
      });

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <Helmet>
        <title>Admin Login - Flynest</title>
        <meta name="description" content="Admin login for Flynest flight booking system." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-300">Sign in to manage the system</p>
          </motion.div>

          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Admin Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@flynest.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

                             <div className="mt-6 pt-6 border-t border-white/10">
                 <Button
                   variant="ghost"
                   onClick={() => navigate('/')}
                   className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                 >
                   Back to Home
                 </Button>
                 
                                   
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
