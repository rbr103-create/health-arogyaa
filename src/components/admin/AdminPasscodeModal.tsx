import React, { useState } from 'react';
import { Lock, X, KeyRound, Check, ShieldAlert } from 'lucide-react';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PIN = '1030'; // Default admin passcode for HealthArogyaa Founder

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('healtharogyaa_admin_pin') || DEFAULT_PIN;
    if (pin === storedPin) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display">Admin Master Access</h3>
              <p className="text-[11px] text-stone-400">Ravi Sushil Bhargav · Founder &amp; Clinical Dietician</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Enter your 4-digit Master Passcode to access live database controls and user compliance records:
          </p>

          <div>
            <input
              type="password"
              maxLength={6}
              autoFocus
              value={pin}
              placeholder="Enter PIN (Default: 1030)"
              onChange={e => {
                setError(false);
                setPin(e.target.value);
              }}
              className={`w-full px-4 py-2.5 bg-stone-50 border rounded-xl text-center text-lg tracking-widest font-mono text-stone-900 focus:outline-none focus:ring-2 ${
                error
                  ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/50'
                  : 'border-stone-300 focus:ring-emerald-500'
              }`}
            />
            {error && (
              <p className="text-[11px] text-rose-600 mt-1 font-semibold text-center">
                Incorrect passcode. Try again or check default (1030).
              </p>
            )}
          </div>

          {/* Quick Unlock for Founder */}
          <button
            type="button"
            onClick={() => {
              setError(false);
              onSuccess();
            }}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick Access as Ravi Sushil Bhargav (PIN 1030)</span>
          </button>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Unlock</span>
            </button>
          </div>

          <p className="text-[10px] text-stone-400 text-center">
            Protects your admin panel when sharing test links with clients &amp; family.
          </p>
        </form>
      </div>
    </div>
  );
};
