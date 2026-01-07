import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

// SVG Icons (inline to avoid dependencies)
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
    <line x1="2" x2="22" y1="2" y2="22"></line>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check server connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await api.testConnection();
      setConnectionStatus(result.connected ? 'connected' : 'error');
      if (!result.connected && import.meta.env.DEV) {
        console.warn('[Stratus] Server connection failed:', result.error);
        console.warn('[Stratus] Server URL:', api.getServerUrl());
      }
    };
    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Thunderstorm Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.pixabay.com/video/2020/06/14/41932-432041624_large.mp4"
          type="video/mp4"
        />
        {/* Fallback to another thunderstorm video if first fails */}
        <source
          src="https://cdn.pixabay.com/video/2021/08/04/84335-585473793_large.mp4"
          type="video/mp4"
        />
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo & Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {/* White Circle with Dark Dot Logo - Inverted for video background */}
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl border-2 border-white">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Stratus
              </h1>
              <p className="text-sm text-white/90 drop-shadow-md">Weather Dashboard</p>
            </div>
          </div>
        </div>

        {/* Connection Status Warning */}
        {connectionStatus === 'error' && (
          <div className="p-3 bg-red-900/40 backdrop-blur-sm border-2 border-white/80 rounded-lg text-white text-sm shadow-xl">
            <p className="font-medium">⚠️ Server Connection Issue</p>
            <p className="text-xs mt-1 text-white/90">Unable to reach the server. Login may fail.</p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-2xl border-2 border-white/80 overflow-hidden">
          <div className="p-6 pb-4 space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-white drop-shadow-lg">
              View-Only Access
            </h2>
            <p className="text-white/90 text-sm drop-shadow-md">
              Sign in to view your assigned weather dashboard
            </p>
          </div>
          
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/40 backdrop-blur-sm border-2 border-white/80 rounded-lg text-white text-sm shadow-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white drop-shadow-md">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-white/80">
                    <MailIcon />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-white placeholder-white/60 shadow-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white drop-shadow-md">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-white/80">
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-white placeholder-white/60 shadow-xl"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-white/80 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || connectionStatus === 'checking'}
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/80 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-center text-sm text-white/90 drop-shadow-md">
          <p>View-only access to your assigned weather dashboard.</p>
          <p className="mt-1">Contact your administrator for login credentials.</p>
        </div>

        {/* Demo Credentials (for testing) */}
        <div className="p-3 bg-white/10 backdrop-blur-md border-2 border-white/80 rounded-lg text-xs shadow-xl">
          <p className="font-medium text-white mb-1 drop-shadow-md">Demo Credentials:</p>
          <p className="text-white/90">Email: <span className="font-mono bg-white/20 px-1 rounded">demo@stratus.app</span></p>
          <p className="text-white/90">Password: <span className="font-mono bg-white/20 px-1 rounded">demo123</span></p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-1">
          <p className="text-xs text-white/90 drop-shadow-md">
            Stratus Weather Station Server v1.0.0
          </p>
          <p className="text-xs text-white/80 drop-shadow-md">
            Developer: <span className="font-medium text-white">Lukas Esterhuizen</span> (esterhuizen2k@proton.me)
          </p>
        </div>
      </div>
    </div>
  );
}
