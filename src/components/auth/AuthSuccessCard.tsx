import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenResult } from '../../services/jagotaApiService';

interface AuthSuccessCardProps {
  authResult: AuthenResult;
  username: string;
  onLogout: () => void;
}

export const AuthSuccessCard: React.FC<AuthSuccessCardProps> = ({
  authResult,
  username,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleContinueToApp = () => {
    navigate('/dashboard');
  };
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg 
            className="h-6 w-6 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Login Successful
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {authResult.STAFF_NAME}!
        </p>
      </div>

      <div className="mt-6">
        <div className="bg-gray-50 px-4 py-3 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Staff Name</dt>
              <dd className="text-sm text-gray-900">{authResult.STAFF_NAME}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="text-sm text-gray-900">{username}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={onLogout}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
        <button
          onClick={handleContinueToApp}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue to App
        </button>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Session expires after inactivity
          </p>
        </div>
      </div>
    </div>
  );
};