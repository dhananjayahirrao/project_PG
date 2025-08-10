import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Plane, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { authAPI } from '@/services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await authAPI.login(formData);
    const { token, user } = response.data;

    localStorage.setItem('flynest_token', token);
    localStorage.setItem('flynest_user', JSON.stringify(user));
    login(user, token); // from AuthContext
    navigate('/dashboard');
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error?.response?.data?.message || "Invalid email or password.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Helmet>
        <title>Login - Flynest | Access Your Flight Booking Account</title>
        <meta name="description" content="Login to your Flynest account to manage bookings, search flights, and access exclusive travel deals." />
      </Helmet>

      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="glass-effect border-white/10">
            <CardHeader className="text-center space-y-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit"
              >
                <Plane className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-gray-300">
                Sign in to your Flynest account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
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
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <p className="text-gray-300">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign up
                  </Link>
                </p>
                
                {/* <div className="text-sm text-gray-400">
                  <p>Demo Accounts:</p>
                  <p>User: user@demo.com / password</p>
                  <p>Admin: admin@demo.com / password</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
