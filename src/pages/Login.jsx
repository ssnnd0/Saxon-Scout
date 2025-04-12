import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  const { login, isAuthenticated, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setShowOfflineWarning(!navigator.onLine);
    };

    // Initial check
    handleOnlineStatus();

    // Listen for changes in online status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    // Clear error for this field if user types
    if (formErrors[id]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [id]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginAttempt(true);

    if (validateForm()) {
      await login(formData.username, formData.password);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Team 611 Saxons</h1>
        <h2 className="text-xl text-blue-400">Scouting System</h2>
      </div>

      {showOfflineWarning && (
        <Alert 
          type="warning" 
          message="You are currently offline. If you have previously logged in, you can still access the app." 
        />
      )}

      {error && loginAttempt && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setLoginAttempt(false)}
        />
      )}

      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <FormInput
              id="username"
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              error={formErrors.username}
              autoComplete="username"
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              error={formErrors.password}
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center text-gray-400 text-sm">
            <p>
              Contact your team admin if you need access to the scouting system.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;