import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import apiService from '../../utils/apiService';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });
  
  // Form state for adding/editing users
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    name: '',
    role: 'scout',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: null }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (formMode === 'add' || formData.password) {
      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const resetForm = () => {
    setFormData({
      id: '',
      username: '',
      name: '',
      role: 'scout',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setFormStatus({
      isSubmitting: false,
      isSubmitted: false,
      error: null
    });
  };
  
  const handleAddUser = () => {
    setFormMode('add');
    resetForm();
    setShowForm(true);
  };
  
  const handleEditUser = (user) => {
    setFormMode('edit');
    setFormData({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role || 'scout',
      password: '',
      confirmPassword: ''
    });
    setSelectedUserId(user.id);
    setShowForm(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });
    
    try {
      if (formMode === 'add') {
        await apiService.addUser({
          username: formData.username,
          name: formData.name,
          password: formData.password,
          role: formData.role
        });
      } else {
        // For edit, only include password if it was provided
        const userData = {
          id: formData.id,
          username: formData.username,
          name: formData.name,
          role: formData.role
        };
        
        if (formData.password) {
          userData.password = formData.password;
        }
        
        await apiService.updateUser(userData);
      }
      
      // Refresh users list
      await fetchUsers();
      
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });
      
      // Hide form and reset after successful submission
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: err.message
      });
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.deleteUser(userId);
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };
  
  if (loading && users.length === 0) {
    return <Spinner size="large" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">User Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </div>
      </div>
      
      {error && <Alert type="error" message={error} />}
      
      {/* Add/Edit User Form */}
      {showForm && (
        <Card title={formMode === 'add' ? 'Add User' : 'Edit User'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formStatus.error && (
              <Alert 
                type="error" 
                message={formStatus.error} 
                onClose={() => setFormStatus(prev => ({ ...prev, error: null }))} 
              />
            )}
            
            {formStatus.isSubmitted && (
              <Alert 
                type="success" 
                message={`User ${formMode === 'add' ? 'added' : 'updated'} successfully!`} 
                autoClose 
              />
            )}
            
            <FormInput
              id="username"
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleFormChange}
              placeholder="Enter username"
              required
              error={formErrors.username}
              autoComplete="off"
            />
            
            <FormInput
              id="name"
              label="Name"
              type="text"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter name"
              required
              error={formErrors.name}
              autoComplete="off"
            />
            
            <FormInput
              id="role"
              label="Role"
              type="select"
              value={formData.role}
              onChange={handleFormChange}
              options={[
                { value: 'scout', label: 'Scout' },
                { value: 'admin', label: 'Administrator' }
              ]}
              required
            />
            
            <FormInput
              id="password"
              label={formMode === 'add' ? 'Password' : 'New Password (leave blank to keep unchanged)'}
              type="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder={formMode === 'add' ? 'Enter password' : 'Enter new password'}
              required={formMode === 'add'}
              error={formErrors.password}
              autoComplete="new-password"
            />
            
            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleFormChange}
              placeholder="Confirm password"
              required={formMode === 'add' || formData.password !== ''}
              error={formErrors.confirmPassword}
              autoComplete="new-password"
            />
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formStatus.isSubmitting}
              >
                {formStatus.isSubmitting ? 'Saving...' : formMode === 'add' ? 'Add User' : 'Update User'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Users List */}
      <Card title="Users" className="overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-indigo-900 text-indigo-200' : 'bg-green-900 text-green-200'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Scout'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">No users found.</p>
          </div>
        )}
      </Card>
      
      {/* Notes on User Management */}
      <Card title="Notes" className="bg-gray-800">
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>At least one administrator account must exist in the system at all times.</li>
          <li>User passwords are securely hashed and stored for maximum security.</li>
          <li>Users can be assigned either Scout or Administrator roles.</li>
          <li>Only administrators can access the admin sections of the application.</li>
          <li>Consider providing training to users before granting access.</li>
        </ul>
      </Card>
    </div>
  );
};

export default UserManagement;