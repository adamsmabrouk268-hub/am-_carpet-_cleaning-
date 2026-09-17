import { useState, FormEvent } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { getAdminPassword, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS } from '../utils/adminStorage';

interface AdminLoginProps {
  onLoginSuccess: (remember: boolean) => void;
  onCancel?: () => void;
}

export const REQUIRED_ADMIN_EMAIL = DEFAULT_ADMIN_EMAIL;
export const REQUIRED_ADMIN_PASS = DEFAULT_ADMIN_PASS;

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAdminPass = getAdminPassword();
  const isCustomPassword = currentAdminPass !== DEFAULT_ADMIN_PASS;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPass = password;

    if (!cleanEmail) {
      setError('Please enter your admin email address.');
      return;
    }

    if (!cleanPass) {
      setError('Please enter your admin password.');
      return;
    }

    setIsSubmitting(true);

    // Verify credentials
    // Email is case-insensitive comparison; password is exact match
    setTimeout(() => {
      const isEmailValid = cleanEmail.toLowerCase() === REQUIRED_ADMIN_EMAIL.toLowerCase();
      const isPassValid = cleanPass === getAdminPassword();

      if (isEmailValid && isPassValid) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(rememberMe);
        }, 600);
      } else {
        setIsSubmitting(false);
        if (!isEmailValid && !isPassValid) {
          setError('Invalid email address and password. Access restricted to authorized A&M Carpet Cleaning staff.');
        } else if (!isEmailValid) {
          setError(`Invalid email address. Please use the registered admin email (${REQUIRED_ADMIN_EMAIL}).`);
        } else {
          setError('Incorrect password. Please verify your administrator password.');
        }
      }
    }, 350);
  };

  const handleQuickFill = () => {
    setEmail(REQUIRED_ADMIN_EMAIL);
    setPassword(getAdminPassword());
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 mb-3 shadow-inner">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Admin Dispatch Portal
          </h2>
          <p className="text-xs text-blue-200/80 mt-1 max-w-xs mx-auto">
            A&M Carpet Cleaning Internal Work Order & Schedule Management
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-900/60 border border-blue-700/50 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide text-blue-300">
            <Lock className="w-3 h-3" />
            <span>Authorized Dispatch Personnel Only</span>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8">
          {/* Quick Fill Credentials Helper Badge */}
          <div className="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between gap-2">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Login Credentials:</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 font-mono select-all">
                Email: <span className="font-bold">{REQUIRED_ADMIN_EMAIL}</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 font-mono select-all flex items-center gap-1">
                Password: <span className="font-bold text-blue-700">{currentAdminPass}</span>
                {isCustomPassword && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans font-bold">
                    Custom Changed
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition shrink-0"
              title="Autofill the email and password"
            >
              Autofill
            </button>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {/* Success Message Alert */}
          {isSuccess && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="font-bold">Credentials verified. Access granted! Opening console...</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="adminProClean@gmail.com"
                  disabled={isSubmitting || isSuccess}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  disabled={isSubmitting || isSuccess}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="admin-login-submit-button"
                disabled={isSubmitting || isSuccess}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Access Granted</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Login to Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Cancel / Return Home */}
          {onCancel && (
            <div className="mt-5 text-center border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Customer Website</span>
              </button>
            </div>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-[11px] text-slate-400 text-center">
          A&M Carpet Cleaning Secure Dispatch System &bull; SSL 256-Bit Encrypted
        </div>
      </div>
    </div>
  );
}
