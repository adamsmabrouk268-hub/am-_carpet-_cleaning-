import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import {
  getAdminPassword,
  setAdminPassword,
  verifyAdminPassword,
  resetAdminPasswordToDefault,
  DEFAULT_ADMIN_PASS
} from '../utils/adminStorage';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged?: () => void;
}

export default function AdminPasswordModal({
  isOpen,
  onClose,
  onPasswordChanged
}: AdminPasswordModalProps) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentActivePass = getAdminPassword();
  const isCustomActive = currentActivePass !== DEFAULT_ADMIN_PASS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPass) {
      setError('Please enter your current admin password.');
      return;
    }

    if (!verifyAdminPassword(currentPass)) {
      setError('Current password is incorrect. Please verify and try again.');
      return;
    }

    if (!newPass || newPass.trim().length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPass === currentPass) {
      setError('New password must be different from the current password.');
      return;
    }

    const ok = setAdminPassword(newPass);
    if (ok) {
      setSuccess('Admin password updated successfully! Use your new password on next login.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      if (onPasswordChanged) onPasswordChanged();
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1800);
    } else {
      setError('Failed to update password. Please try again.');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm(`Reset admin password back to standard default (${DEFAULT_ADMIN_PASS})?`)) {
      resetAdminPasswordToDefault();
      setSuccess(`Password successfully reset to default: ${DEFAULT_ADMIN_PASS}`);
      setError(null);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      if (onPasswordChanged) onPasswordChanged();
      setTimeout(() => {
        setSuccess(null);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Change Admin Password</h3>
              <p className="text-[11px] text-slate-300">Update master credentials for A&M Carpet Cleaning console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Status Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-700">Current Active Password:</div>
              <div className="font-mono text-slate-800 text-xs mt-0.5">
                {currentActivePass}
              </div>
            </div>
            {isCustomActive && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg transition cursor-pointer"
                title="Reset to default password"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Current Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Current Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                >
                  {showCurrent ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPass}
                  onChange={(e) => {
                    setCurrentPass(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter current password..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  New Password * (Min 6 chars)
                </label>
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                >
                  {showNew ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => {
                    setNewPass(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter new strong password..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Confirm New Password *
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Repeat new password..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Save New Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
