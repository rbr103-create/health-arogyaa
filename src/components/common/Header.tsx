import React from 'react';
import { UserProfile } from '../../types';
import { HealthArogyaaLogo } from './HealthArogyaaLogo';
import {
  ShieldCheck,
  Sparkles,
  Scale,
  Camera,
  Award,
  Smartphone,
  Home,
  Calendar,
  Lightbulb,
  UserPlus,
  UtensilsCrossed,
  Users,
  FileText,
  ArrowLeftRight,
  CreditCard,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  adminTab?: 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions';
  setAdminTab?: (tab: 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions') => void;
  activeUser: UserProfile;
  onOpenProfileModal: () => void;
  onOpenWeightModal: () => void;
  onOpenScannerModal: () => void;
  onOpenExpertModal: () => void;
  onOpenMobileTestModal: () => void;
  onOpenCalendarModal?: () => void;
  onOpenPremiumModal?: () => void;
  onOpenOnboardingModal?: () => void;
  onOpenMethodologyModal?: () => void;
  onOpenDisclaimerModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  adminTab = 'foods',
  setAdminTab,
  activeUser,
  onOpenProfileModal,
  onOpenWeightModal,
  onOpenScannerModal,
  onOpenExpertModal,
  onOpenMobileTestModal,
  onOpenCalendarModal,
  onOpenPremiumModal,
  onOpenOnboardingModal,
  onOpenMethodologyModal,
  onOpenDisclaimerModal,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 transition-colors border-b backdrop-blur-md ${
        isAdminMode
          ? 'bg-stone-950 text-stone-100 border-amber-900/60 shadow-md'
          : 'bg-stone-900 text-stone-100 border-stone-800 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Identity & Mode Tag */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (isAdminMode) {
                  if (setAdminTab) setAdminTab('foods');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className="text-left group flex items-center gap-2.5 focus:outline-none min-w-0 cursor-pointer"
              title={isAdminMode ? 'Dietician Admin Portal' : 'Go to Home Dashboard'}
            >
              {/* Prominent Circular Brand Logo */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-500/20">
                <HealthArogyaaLogo className="w-full h-full" />
              </div>

              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white whitespace-nowrap leading-none">
                  Health<span className="text-emerald-400">Arogyaa</span>
                </span>
                <span className="text-[10px] text-stone-400 hidden sm:block tracking-wide">
                  Holistic Nutrition &amp; Wellness
                </span>
              </div>
            </button>

            {isAdminMode && (
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="px-2 py-0.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 border border-amber-500/50 text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors"
                title="Currently in Admin Mode. Click to switch to Patient App"
              >
                🛡️ Admin Mode
              </button>
            )}
          </div>

          {!isAdminMode && (
            <button
              onClick={() => {
                setActiveTab('dashboard');
              }}
              className={`hidden sm:flex px-2.5 py-1 rounded-lg text-xs font-semibold items-center gap-1.5 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="Return to Home Dashboard"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>Home</span>
            </button>
          )}
        </div>

        {/* Center Nav: Distinct based on Mode */}
        {isAdminMode ? (
          /* ================= ADMIN MODE NAVIGATION ================= */
          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold text-stone-300">
            <button
              onClick={() => setAdminTab && setAdminTab('foods')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                adminTab === 'foods'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:text-white hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
              <span>Food Database</span>
            </button>

            <button
              onClick={() => setAdminTab && setAdminTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                adminTab === 'users'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:text-white hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client Directory</span>
            </button>

            <button
              onClick={() => setAdminTab && setAdminTab('consultations')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                adminTab === 'consultations'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:text-white hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consultations</span>
            </button>

            <button
              onClick={() => setAdminTab && setAdminTab('reviews')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                adminTab === 'reviews'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:text-white hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reviews Queue</span>
            </button>

            <button
              onClick={() => setAdminTab && setAdminTab('subscriptions')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                adminTab === 'subscriptions'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:text-white hover:bg-stone-800/80 text-stone-300'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>UPI Subscriptions</span>
            </button>
          </nav>
        ) : (
          /* ================= CLIENT MODE NAVIGATION ================= */
          <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-stone-300">
            <button
              onClick={onOpenCalendarModal}
              className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>15-Day Calendar</span>
            </button>

            <button
              onClick={onOpenScannerModal}
              className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Food Scanner</span>
            </button>

            <button
              onClick={onOpenWeightModal}
              className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Weight Progress</span>
            </button>

            <button
              onClick={onOpenExpertModal}
              className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dietician Services</span>
            </button>

            <button
              onClick={onOpenMobileTestModal}
              className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 py-1 text-emerald-400 font-semibold"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Test on Mobile</span>
            </button>
          </nav>
        )}

        {/* Right Actions: Obvious Switch Button & Profile / Induction */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isAdminMode ? (
            /* ADMIN ACTIONS */
            <>
              <button
                onClick={onOpenOnboardingModal}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 text-stone-200 border border-stone-700 hover:bg-stone-700 rounded-xl text-xs font-semibold transition-colors"
                title="Induct a New Client with full dietary and clinical parameters"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Induct Client</span>
              </button>

              {/* High-visibility Switch to Client App button */}
              <button
                onClick={() => setIsAdminMode(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                title="Exit Admin Console and return to Client Health App"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Exit Admin Console</span>
              </button>
            </>
          ) : (
            /* CLIENT ACTIONS */
            <>
              {/* Premium Plan Button */}
              <button
                onClick={onOpenPremiumModal}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                  activeUser.planLevel === 'premium'
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                }`}
                title="HealthArogyaa Premium: Build your day for ₹199/month"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">
                  {activeUser.planLevel === 'premium' ? 'Pro Active' : 'Plans from ₹150/mo'}
                </span>
                <span className="sm:hidden">
                  {activeUser.planLevel === 'premium' ? 'Pro' : 'Upgrade'}
                </span>
              </button>

              {/* New User Profile / Sign Up Button */}
              <button
                onClick={onOpenOnboardingModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/60 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Create a New User Profile / Sign Up"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">+ New Profile</span>
                <span className="sm:hidden">+ Profile</span>
              </button>

              {/* User Profile */}
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2.5 py-1 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-xl text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                title={`Active profile: ${activeUser.name} (Click to edit or switch profile)`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {activeUser.name.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">{activeUser.name}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
