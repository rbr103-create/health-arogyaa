import React, { useState } from 'react';
import {
  Smartphone,
  X,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Share2,
  Users,
  MessageCircle,
  Download,
  FolderArchive,
} from 'lucide-react';
import { downloadSourceZip, downloadDistZip } from '../../utils/downloadZip';

interface MobileTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileTestModal: React.FC<MobileTestModalProps> = ({ isOpen, onClose }) => {
  const [copiedActive, setCopiedActive] = useState(false);

  if (!isOpen) return null;

  // Dynamically detect current active origin
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const activeUrl = currentOrigin && !currentOrigin.includes('localhost') && !currentOrigin.includes('127.0.0.1')
    ? currentOrigin
    : 'https://ais-dev-2m2mxfnxzkiu2hi7ppjyqd-46667845869.asia-southeast1.run.app';

  const handleCopyActive = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopiedActive(true);
    setTimeout(() => setCopiedActive(false), 2200);
  };

  const whatsappShareText = encodeURIComponent(
    `Hi! Please test HealthArogyaa nutrition app on your mobile phone: ${activeUrl}\n\nOpen in Safari or Chrome and tap "Add to Home Screen" to install it!`
  );

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    activeUrl
  )}&bgcolor=ffffff&color=1c1917&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Download &amp; Test on Mobile
              </h2>
              <p className="text-xs text-stone-300">
                Share with family &amp; friends for reviews and alterations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-stone-800">
          {/* Quick Share Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Family &amp; Client Testing Link (Publicly Accessible)</span>
              </span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Active &amp; Live
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Anyone with this link can open the app on their phone, log meals, test the food scanner, and experience the complete user interface.
            </p>

            {/* Quick Actions: WhatsApp & Copy */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send to Family via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyActive}
                className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {copiedActive ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedActive ? 'Link Copied! ✓' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Direct ZIP Download Section for Vercel / Netlify */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <FolderArchive className="w-4 h-4 text-amber-700" />
                <span>Download Project Code (.ZIP)</span>
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                Latest Updated
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Download the complete codebase package to deploy to Vercel, upload to GitHub, or store a local backup:
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => downloadSourceZip()}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Source Code (.ZIP)</span>
              </button>
              <button
                type="button"
                onClick={() => downloadDistZip()}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Pre-Built Dist (.ZIP)</span>
              </button>
            </div>
          </div>

          {/* QR Code Section for Camera Scan */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-center space-y-2.5">
            <span className="text-xs font-bold text-stone-800 block">
              Scan with your Phone Camera:
            </span>
            <div className="inline-block p-2.5 bg-white rounded-2xl shadow-xs border border-stone-200">
              <img
                src={qrCodeUrl}
                alt="Scan to open HealthArogyaa on mobile"
                className="w-40 h-40 object-contain mx-auto"
                loading="eager"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              Points directly to your live shared instance in Safari or Chrome
            </p>
          </div>

          {/* How to "Download / Install" as a Real App */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>How to Install as an App Icon on Home Screen (PWA):</span>
            </div>

            <div className="space-y-2.5 text-xs text-stone-600 pl-1">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                <span className="font-bold text-stone-900 block">
                  📱 On iPhone (Safari):
                </span>
                <p className="text-[11px] leading-relaxed">
                  1. Open the link in Safari &rarr; Tap the <strong>Share icon</strong> (square with an up-arrow at the bottom).<br />
                  2. Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.<br />
                  3. Tap <strong>Add</strong>. An app icon titled <strong>HealthArogyaa</strong> will appear on your iPhone screen! It opens in full-screen mode like a native app.
                </p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                <span className="font-bold text-stone-900 block">
                  🤖 On Android (Google Chrome):
                </span>
                <p className="text-[11px] leading-relaxed">
                  1. Open the link in Chrome &rarr; Tap the <strong>three dots</strong> (top-right menu).<br />
                  2. Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.<br />
                  3. The HealthArogyaa app icon will be installed directly on your app drawer and home screen.
                </p>
              </div>
            </div>
          </div>

          {/* Testing & Review Instructions */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <strong className="font-bold text-stone-900 block">
              How to Review &amp; Suggest Alterations:
            </strong>
            <p className="text-[11px] leading-relaxed">
              Family members can test meal logging, check calorie recommendations, and take photos of food labels. Any alterations you request will update live immediately on the shared link!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> PWA Standalone Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
