import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "../components/auth/LoginForm";
import { AuthSuccessCard } from "../components/auth/AuthSuccessCard";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    authResult,
    isAuthenticated,
    username,
    login,
    logout,
  } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && authResult) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authResult, navigate]);

  if (isAuthenticated && authResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AuthSuccessCard
            authResult={authResult}
            username={username || "Unknown"}
            onLogout={logout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-12 w-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Login Import Document
              </h2>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onSubmit={login} loading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Login;
