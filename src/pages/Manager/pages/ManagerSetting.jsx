import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LockClosedIcon, AtSymbolIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AuthContext } from "../../../context/AuthContext";
function ManagerSettings() {
    const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Initiate, 2: OTP, 3: New Credentials
  const [changeType, setChangeType] = useState(''); // 'password' or 'username'
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState(user.email); // Replace with actual user email from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const initiateChange = async (type) => {
    setChangeType(type);
    setLoading(true);
    setError('');
    
    try {
      // Send request to backend to initiate OTP process
      const response = await axios.post('http://localhost:8000/settings/initiate-change.php', {
        changeType: type,
        currentPassword: formData.currentPassword,
        email: email
      });

      if (response.data.status) {
        setOtpSent(true);
        setCurrentStep(2);
        setSuccess(`OTP sent to ${email}`);
      } else {
        setError(response.data.message || 'Failed to initiate change');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await axios.post('http://localhost:8000/settings/verify-otp.php', {
        otp: formData.otp,
        email: email, // Use the email from state
        changeType: changeType // Include the change type
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
        
      if (response.data.status) {
        setCurrentStep(3);
        setSuccess(response.data.message || 'OTP verified successfully');
        // Clear OTP field after successful verification
        setFormData(prev => ({ ...prev, otp: '' }));
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error verifying OTP. Please try again.';
      setError(errorMessage);
      
      // If it's an OTP expiry error, allow resend
      if (err.response?.data?.code === 'OTP_EXPIRED') {
        setCurrentStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCredentials = async () => {
    if (changeType === 'password' && formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/settings/update-credentials.php', {
        changeType,
        newValue: changeType === 'password' ? formData.newPassword : formData.newUsername,
        email
      });

      if (response.data.status) {
        setSuccess(`Your ${changeType} has been updated successfully!`);
        // Clear form and reset
        setTimeout(() => {
          setFormData({
            currentPassword: '',
            newUsername: '',
            newPassword: '',
            confirmPassword: '',
            otp: ''
          });
          setCurrentStep(1);
          setChangeType('');
        }, 3000);
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating credentials');
    } finally {
      setLoading(false);
    }
  };

  const cancelProcess = () => {
    setCurrentStep(1);
    setChangeType('');
    setFormData({
      currentPassword: '',
      newUsername: '',
      newPassword: '',
      confirmPassword: '',
      otp: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Account Settings</h2>
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <XCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Step 1: Initiate Change */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What would you like to change?</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setChangeType('username')}
                  className={`p-4 border rounded-lg flex items-center ${changeType === 'username' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                >
                  <AtSymbolIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span>Change Username</span>
                </button>
                
                <button
                  onClick={() => setChangeType('password')}
                  className={`p-4 border rounded-lg flex items-center ${changeType === 'password' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                >
                  <LockClosedIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>

            {changeType && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => initiateChange(changeType)}
                  disabled={loading || !formData.currentPassword}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Continue with OTP Verification'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Verify Your Identity</h3>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a 6-digit OTP to {email}. Please enter it below.
              </p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                inputMode="numeric"
                pattern="\d{6}"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cancelProcess}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={verifyOTP}
                disabled={loading || !formData.otp || formData.otp.length !== 6}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center text-sm">
              <button 
                onClick={() => initiateChange(changeType)} 
                className="text-blue-600 hover:text-blue-500"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Credentials */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Set New {changeType === 'password' ? 'Password' : 'Username'}
              </h3>
            </div>

            {changeType === 'username' && (
              <div>
                <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
                  New Username
                </label>
                <input
                  type="text"
                  id="newUsername"
                  name="newUsername"
                  value={formData.newUsername}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {changeType === 'password' && (
              <>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3">
              <button
                onClick={cancelProcess}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={updateCredentials}
                disabled={loading || 
                  (changeType === 'password' 
                    ? !formData.newPassword || !formData.confirmPassword 
                    : !formData.newUsername)}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerSettings;