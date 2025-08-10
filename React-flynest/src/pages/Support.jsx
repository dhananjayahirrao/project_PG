import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportFeatures = [
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your travel needs"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through our live chat system"
    },
    {
      icon: Shield,
      title: "Secure Communication",
      description: "Your information is protected with bank-level security"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Support - Flynest</title>
        <meta name="description" content="Get help and support for your Flynest bookings and travel queries." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">We're Here to Help</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Need assistance with your bookings or travel plans? Reach out to us anytime.
            </p>
          </motion.div>

          {/* Support Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {supportFeatures.map((feature, index) => (
              <Card key={index} className="glass-effect border-white/10">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    <span>Send Us a Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-300 mb-4">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-white">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="What is this about?"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-white">Message</Label>
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          placeholder="How can we help you?"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 text-white placeholder:text-gray-400 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-purple-400" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-gray-300 text-sm">support@flynest.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Phone className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Phone</p>
                        <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Address</p>
                        <p className="text-gray-300 text-sm">123 Aviation St, Sky City</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Response Time</h4>
                        <p className="text-sm text-gray-300">
                          We typically respond within 24 hours. Our team is available 24/7 for urgent travel queries.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;