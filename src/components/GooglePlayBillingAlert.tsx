import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  X,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  Sliders,
  Users,
  Smartphone,
  Lock,
  Check,
  ChevronRight
} from 'lucide-react';

interface GooglePlayBillingAlertProps {
  theme?: 'light' | 'dark';
  adminEmail?: string;
  className?: string;
}

const STORAGE_KEY = 'am_google_play_billing_status_v1';

export type PlayBillingStatus = 'warning' | 'dismissed' | 'configured';

export default function GooglePlayBillingAlert({
  theme = 'light',
  adminEmail = 'adamsmabrouk268@gmail.com',
  className = ''
}: GooglePlayBillingAlertProps) {
  const [status, setStatus] = useState<PlayBillingStatus>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dismissed' || stored === 'configured' || stored === 'warning') {
        return stored;
      }
    } catch {
      // fallback
    }
    return 'warning';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('am_google_play_checklist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      step1: false,
      step2: false,
      step3: false,
      step4: false
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('am_google_play_checklist', JSON.stringify(checklist));
    } catch {
      // ignore
    }
  }, [checklist]);

  const updateStatus = (newStatus: PlayBillingStatus) => {
    setStatus(newStatus);
    try {
      localStorage.setItem(STORAGE_KEY, newStatus);
    } catch {
      // ignore
    }
  };

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isDark = theme === 'dark';

  // If dismissed or configured, we show a compact status pill with re-open option
  if (status === 'dismissed') {
    return (
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium transition ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/80 text-slate-300'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold">⚠️</span>
          <span>
            Google Play Console monthly subscription notice is snoozed.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold underline hover:text-amber-600 transition cursor-pointer"
          >
            Review Set Billings
          </button>
          <span className="text-slate-400">•</span>
          <button
            onClick={() => updateStatus('warning')}
            className="font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            Restore Full Alert
          </button>
        </div>
        {isModalOpen && renderModal()}
      </div>
    );
  }

  if (status === 'configured') {
    return (
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium transition ${
          isDark
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>
            Google Play Console monthly subscription & billings verified. Customer access enabled.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold underline hover:text-emerald-700 dark:hover:text-emerald-200 cursor-pointer"
          >
            View Configuration
          </button>
          <span className="text-slate-400">•</span>
          <button
            onClick={() => updateStatus('warning')}
            className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
          >
            Reopen Alert
          </button>
        </div>
        {isModalOpen && renderModal()}
      </div>
    );
  }

  // Active Alert Banner
  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition shadow-md ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/70 border-amber-500/80 text-white'
            : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-amber-400 text-slate-900'
        } ${className}`}
      >
        {/* Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 animate-pulse" />

        <div className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Icon & Alert Messaging */}
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 sm:p-3 rounded-2xl shrink-0 mt-0.5 shadow-sm ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-amber-500 text-white shadow-amber-200'
                }`}
              >
                <span className="text-2xl sm:text-3xl leading-none block select-none">⚠️</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-400/40">
                    <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    Important Console Notice
                  </span>
                  <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-300/40 animate-pulse">
                    Action Required
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Google Play Console Migration
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                  <span>Google Play Console monthly subscription is moved: set billings to access customer</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                  Google Play Console has migrated monthly subscription configuration under the unified{' '}
                  <span className="font-bold underline decoration-amber-500 decoration-2">
                    Monetize &gt; Subscriptions
                  </span>{' '}
                  portal. You must <span className="font-extrabold text-amber-800 dark:text-amber-300">set billings</span> and configure your payments profile to unlock full customer access, activate recurring client management, and prevent subscription order drops.
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Billing Profile: <strong>Required</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                    <span>Customer Access: <strong>Locked until billings set</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Console Admin: <strong>{adminEmail}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive CTA Controls */}
            <div className="flex flex-row md:flex-col sm:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Set Billings & Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href="https://play.google.com/console/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-600 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Open Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs mt-1">
                <button
                  type="button"
                  onClick={() => updateStatus('configured')}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  title="Mark billings as already configured"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as Set</span>
                </button>
                <span className="text-slate-400">&bull;</span>
                <button
                  type="button"
                  onClick={() => updateStatus('dismissed')}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium cursor-pointer"
                  title="Snooze alert banner"
                >
                  Snooze
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && renderModal()}
    </>
  );

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-8">
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
              ⚠️
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 mb-1">
                Google Play Console Alert
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Monthly Subscription Moved: Set Billings to Access Customer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Action required for administrator account: <span className="font-mono text-blue-600 dark:text-sky-400">{adminEmail}</span>
              </p>
            </div>
          </div>

          {/* Detailed Context Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 mb-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Why are you seeing this alert?
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
              Google has migrated monthly subscriptions in Google Play Console. Previously configured standalone recurring products have moved to the new unified <strong>Base Plans &amp; Offers</strong> structure. Until you set billings and link an active payments profile, customer account records, dispatch entitlement tokens, and client subscription renewals cannot be synchronized.
            </p>
          </div>

          {/* Action Step-by-Step Checklist */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Required Setup Checklist (Complete each step):
            </h4>

            {/* Step 1 */}
            <div
              onClick={() => toggleChecklist('step1')}
              className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                checklist.step1
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 border transition ${
                  checklist.step1
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-400 dark:border-slate-500'
                }`}
              >
                {checklist.step1 && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-bold block">1. Sign In to Google Play Console</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Log in at <span className="font-mono text-blue-600 dark:text-sky-400">play.google.com/console</span> using your developer credential ({adminEmail}).
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => toggleChecklist('step2')}
              className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                checklist.step2
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 border transition ${
                  checklist.step2
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-400 dark:border-slate-500'
                }`}
              >
                {checklist.step2 && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-bold block">2. Navigate to Monetize &gt; Financial Setup &gt; Set Billings</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Go to <strong>Monetize with Google Play</strong> &rarr; <strong>Payment settings</strong> and connect or verify your Google Payments Merchant Profile.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => toggleChecklist('step3')}
              className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                checklist.step3
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 border transition ${
                  checklist.step3
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-400 dark:border-slate-500'
                }`}
              >
                {checklist.step3 && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-bold block">3. Relink Monthly Subscription Base Plan</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  In <strong>Subscriptions</strong>, click your active monthly tier and set the monthly billing cycle, grace period, and customer billing retry terms.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => toggleChecklist('step4')}
              className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                checklist.step4
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 border transition ${
                  checklist.step4
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-400 dark:border-slate-500'
                }`}
              >
                {checklist.step4 && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-bold block">4. Grant Customer Access Permissions</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Under <strong>API access &amp; Users &amp; permissions</strong>, enable <em>Manage orders &amp; subscriptions</em> to allow the dispatch portal to look up customer plans.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <a
              href="https://play.google.com/console/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Launch Google Play Console</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  updateStatus('configured');
                  setIsModalOpen(false);
                }}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Mark as Set &amp; Resolved</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateStatus('dismissed');
                  setIsModalOpen(false);
                }}
                className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Snooze
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
