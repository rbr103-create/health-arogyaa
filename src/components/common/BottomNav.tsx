import React from 'react';
import {
  Home,
  Camera,
  Scale,
  Award,
  ShieldCheck,
  UtensilsCrossed,
  Users,
  Calendar,
  FileText,
  ArrowLeftRight,
  CreditCard,
  User,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  adminTab?: 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions';
  setAdminTab?: (tab: 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions') => void;
  onOpenScannerModal: () => void;
  onOpenWeightModal: () => void;
  onOpenExpertModal: () => void;
  onOpenCalendarModal?: () => void;
  onOpenProfileModal?: () => void;
  activeUserName?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  adminTab = 'foods',
  setAdminTab,
  onOpenScannerModal,
  onOpenWeightModal,
  onOpenExpertModal,
  onOpenCalendarModal,
  onOpenProfileModal,
  activeUserName,
}) => {
  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t pb-safe transition-colors ${
        isAdminMode
          ? 'bg-stone-950/95 border-amber-900/60'
          : 'bg-stone-900/95 border-stone-800'
      }`}
    >
      {isAdminMode ? (
        /* ================= ADMIN MOBILE CONTROLS ================= */
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
          {/* Foods Database */}
          <button
            onClick={() => setAdminTab && setAdminTab('foods')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              adminTab === 'foods'
                ? 'text-amber-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Foods</span>
          </button>

          {/* Client Directory */}
          <button
            onClick={() => setAdminTab && setAdminTab('users')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              adminTab === 'users'
                ? 'text-amber-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Clients</span>
          </button>

          {/* Consultations */}
          <button
            onClick={() => setAdminTab && setAdminTab('consultations')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              adminTab === 'consultations'
                ? 'text-amber-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Consults</span>
          </button>

          {/* Reviews Queue */}
          <button
            onClick={() => setAdminTab && setAdminTab('reviews')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              adminTab === 'reviews'
                ? 'text-amber-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Reviews</span>
          </button>

          {/* Subscriptions & UPI Payments */}
          <button
            onClick={() => setAdminTab && setAdminTab('subscriptions')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              adminTab === 'subscriptions'
                ? 'text-amber-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">UPI Subs</span>
          </button>

          {/* Exit Admin to Client App */}
          <button
            onClick={() => setIsAdminMode(false)}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Switch back to Client App View"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight font-bold">Client App</span>
          </button>
        </div>
      ) : (
        /* ================= CLIENT MOBILE CONTROLS ================= */
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
          {/* Home Dashboard */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              activeTab === 'dashboard'
                ? 'text-emerald-400 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Home Dashboard"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight font-medium">Home</span>
          </button>

          {/* Scanner */}
          <button
            onClick={onOpenScannerModal}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-400 hover:text-stone-200 transition-colors"
            title="Food & Label Scanner"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Scan</span>
          </button>

          {/* Weight Progress */}
          <button
            onClick={onOpenWeightModal}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-400 hover:text-stone-200 transition-colors"
            title="Weight Progress & History"
          >
            <Scale className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Progress</span>
          </button>

          {/* Expert Services */}
          <button
            onClick={onOpenExpertModal}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-400 hover:text-stone-200 transition-colors"
            title="Consultation & Dietician Reviews"
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Expert</span>
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenProfileModal}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-400 hover:text-emerald-300 transition-colors"
            title="My Health Profile, Edit Goals & Switch Users"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600/90 text-white flex items-center justify-center font-bold text-[10px] shrink-0 border border-emerald-400/40">
              {activeUserName ? activeUserName.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px] text-stone-300 font-medium">
              Profile
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
