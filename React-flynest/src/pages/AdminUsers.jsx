import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  ArrowLeft,
  Filter,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { adminAPI } from '@/services/api';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('flynest_admin_token');
    if (!adminToken) {
      toast({
        title: "Access Denied",
        description: "Please log in as admin to access this page.",
        variant: "destructive"
      });
      navigate('/admin-login');
      return;
    }

    loadUsers();
  }, [navigate]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading users...');
      
      let response;
      try {
        response = await adminAPI.getAllUsers();
        console.log('Users loaded successfully:', response.data);
      } catch (error) {
        console.log('Primary users endpoint failed, trying alternative...', error);
        response = await adminAPI.getAllUsersAlt();
        console.log('Alternative users endpoint successful:', response.data);
      }
      
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Deleting user with ID:', userId);
      const response = await adminAPI.deleteUser(userId);
      console.log('Delete user response:', response);
      
      toast({
        title: "Success",
        description: "User deleted successfully."
      });
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Try alternative delete method
      try {
        console.log('Trying alternative delete method...');
        const { userAPI } = await import('@/services/api');
        await userAPI.deleteUser(userId);
        
        toast({
          title: "Success",
          description: "User deleted successfully."
        });
        loadUsers();
      } catch (altError) {
        console.error('Alternative delete also failed:', altError);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete user. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      console.log('Updating user with ID:', userId, 'Data:', userData);
      const response = await adminAPI.updateUser(userId, userData);
      console.log('Update user response:', response);
      
      toast({
        title: "Success",
        description: "User updated successfully."
      });
      setShowUserModal(false);
      setSelectedUser(null);
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Try alternative update method
      try {
        console.log('Trying alternative update method...');
        const { userAPI } = await import('@/services/api');
        await userAPI.updateProfile(userData);
        
        toast({
          title: "Success",
          description: "User updated successfully."
        });
        setShowUserModal(false);
        setSelectedUser(null);
        loadUsers();
      } catch (altError) {
        console.error('Alternative update also failed:', altError);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update user. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const openUserModal = (user, viewOnly = false) => {
    setSelectedUser({ ...user });
    setShowUserModal(true);
    setIsViewOnly(viewOnly);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin Dashboard</title>
        <meta name="description" content="Manage users in Flynest admin dashboard." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Manage Users
                  </h1>
                  <p className="text-gray-300">
                    View and manage all registered users ({users.length} total)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <Card className="glass-effect border-white/10 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                
                {/* Debug button for testing API */}
                {/* {process.env.NODE_ENV === 'development' && (
                  <Button
                    onClick={async () => {
                      if (users.length > 0) {
                        const firstUser = users[0];
                        console.log('Testing admin API for user:', firstUser.id);
                        await adminAPI.testUserEndpoints(firstUser.id);
                        toast({
                          title: "API Test",
                          description: "Check console for admin API test results",
                        });
                      }
                    }}
                    variant="outline"
                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Test Admin API
                  </Button>
                )} */}
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>All Users ({filteredUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}  ({user.userId})</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUserModal(user, true)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUserModal(user, false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.userId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {isViewOnly ? 'View User Details' : 'Edit User Details'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">User Id</label>
                <Input
                  value={selectedUser.userId || ''}
                  onChange={(e) => !isViewOnly && setSelectedUser({...selectedUser, userId: e.target.value})}
                  readOnly={isViewOnly}
                  className="bg-white/5 border-white/20 text-white read-only:bg-slate-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <Input
                  value={selectedUser.name || ''}
                  onChange={(e) => !isViewOnly && setSelectedUser({...selectedUser, name: e.target.value})}
                  readOnly={isViewOnly}
                  className="bg-white/5 border-white/20 text-white read-only:bg-slate-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <Input
                  value={selectedUser.email || ''}
                  onChange={(e) => !isViewOnly && setSelectedUser({...selectedUser, email: e.target.value})}
                  readOnly={isViewOnly}
                  className="bg-white/5 border-white/20 text-white read-only:bg-slate-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <Input
                  value={selectedUser.phone || ''}
                  onChange={(e) => !isViewOnly && setSelectedUser({...selectedUser, phone: e.target.value})}
                  readOnly={isViewOnly}
                  className="bg-white/5 border-white/20 text-white read-only:bg-slate-700"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              {!isViewOnly && (
                <Button
                  onClick={() => handleUpdateUser(selectedUser.userId, selectedUser)}
                  className="flex-1"
                >
                  Update User
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1"
              >
                {isViewOnly ? 'Close' : 'Cancel'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;