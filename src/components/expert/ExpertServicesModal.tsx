import React, { useState } from 'react';
import { UserProfile, ExpertReviewRequest, ConsultationBooking } from '../../types';
import {
  Award,
  X,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Send,
  User,
  ShieldCheck,
} from 'lucide-react';

interface ExpertServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  expertReviews: ExpertReviewRequest[];
  consultations: ConsultationBooking[];
  onSubmitReviewRequest: (req: Omit<ExpertReviewRequest, 'id' | 'status'>) => void;
  onBookConsultation: (booking: Omit<ConsultationBooking, 'id' | 'status'>) => void;
}

export const ExpertServicesModal: React.FC<ExpertServicesModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  expertReviews,
  consultations,
  onSubmitReviewRequest,
  onBookConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'consultation' | 'my_requests'>('review');

  // Form states for Written Review
  const [reviewType, setReviewType] = useState<ExpertReviewRequest['reviewType']>('Food Diary Review');
  const [userNotes, setUserNotes] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Form states for 30-min Consultation
  const [slotDate, setSlotDate] = useState('2026-10-06');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 11:30 AM');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);

  if (!isOpen) return null;

  const userReviews = expertReviews.filter(r => r.userId === userProfile.id);
  const userConsultations = consultations.filter(c => c.userId === userProfile.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReviewRequest({
      userId: userProfile.id,
      userName: userProfile.name,
      date: new Date().toISOString().split('T')[0],
      reviewType,
      userNotes: userNotes || 'Please review my daily food logs and portion control.',
      amountPaid: 499,
    });
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setActiveTab('my_requests');
    }, 1200);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookConsultation({
      userId: userProfile.id,
      userName: userProfile.name,
      userPhone,
      date: slotDate,
      timeSlot,
      durationMinutes: 30,
      goal: userProfile.goal.replace('_', ' ').toUpperCase(),
      currentWeightKg: userProfile.weightKg,
      startingWeightKg: userProfile.startingWeightKg,
      dailyTargetCalories: userProfile.dailyCalories,
      amountPaid: 1499,
    });
    setConsultationSubmitted(true);
    setTimeout(() => {
      setConsultationSubmitted(false);
      setActiveTab('my_requests');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Level 3 · Human Nutritionist Services
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-xs text-stone-500">Clinical Expertise</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
              HealthArogyaa Expert Services
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-3 border-b border-stone-200 bg-white flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'review'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Written Expert Review (₹499)</span>
          </button>

          <button
            onClick={() => setActiveTab('consultation')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'consultation'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>30-Min Consultation (₹1,499)</span>
          </button>

          <button
            onClick={() => setActiveTab('my_requests')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'my_requests'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>My Records</span>
            {(userReviews.length > 0 || userConsultations.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: Written Expert Review */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-emerald-900 block">
                  How the Written Expert Review Works:
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You submit your food diary and questions. An expert Indian clinical dietitian reviews your daily calories, portion sizes, roti/rice combinations, and weight history. Within 24 hours, you receive actionable observations and routine adjustments directly in your account.
                </p>
              </div>

              {reviewSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                  <h4 className="font-bold text-stone-900 text-sm">
                    Review Request Submitted Successfully!
                  </h4>
                  <p className="text-xs text-stone-600">
                    The admin panel has received your request. Redirecting to your records...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      What would you like reviewed?
                    </label>
                    <select
                      value={reviewType}
                      onChange={e => setReviewType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Food Diary Review">Food Diary Review (Recent Breakfast, Lunch, Dinner)</option>
                      <option value="Food Choices">My Food Choices & Healthy Swaps</option>
                      <option value="Daily Meal Pattern">My Daily Meal Pattern & Timing</option>
                      <option value="Weight Management Progress">My Weight-Management Progress & Milestones</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Specific questions or details for the Dietitian:
                    </label>
                    <textarea
                      rows={3}
                      value={userNotes}
                      onChange={e => setUserNotes(e.target.value)}
                      placeholder="e.g. I want to lose 10 kg without cutting out rotis. Please verify my lunch portion and evening snack routine..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-800 block">Service Fee</span>
                      <span className="text-stone-500 text-[11px]">Includes written notes & feedback</span>
                    </div>
                    <span className="text-base font-extrabold text-stone-900 font-display">
                      ₹499
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Expert Review Request (₹499)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: 30-Minute Consultation */}
          {activeTab === 'consultation' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-emerald-900 block">
                  30-Minute One-on-One Expert Consultation:
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Speak directly with an Indian clinical dietitian over a focused 30-minute consultation call. We discuss your lifestyle, body composition, medical parameters, and customized meal strategies.
                </p>
              </div>

              {consultationSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                  <h4 className="font-bold text-stone-900 text-sm">
                    Consultation Booked Successfully!
                  </h4>
                  <p className="text-xs text-stone-600">
                    Your appointment slot is confirmed and reflected in the admin dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1">
                        Select Consultation Date:
                      </label>
                      <input
                        type="date"
                        value={slotDate}
                        onChange={e => setSlotDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1">
                        Select 30-Minute Slot:
                      </label>
                      <select
                        value={timeSlot}
                        onChange={e => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                        <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                        <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                        <option value="05:00 PM - 05:30 PM">05:00 PM - 05:30 PM</option>
                        <option value="06:30 PM - 07:00 PM">06:30 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Contact Mobile Number (for WhatsApp / Call):
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={e => setUserPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-800 block">30-Min Consultation Fee</span>
                      <span className="text-stone-500 text-[11px]">Direct 1-on-1 audio/video call</span>
                    </div>
                    <span className="text-base font-extrabold text-stone-900 font-display">
                      ₹1,499
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Confirm 30-Minute Consultation (₹1,499)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: My Records (User Review History) */}
          {activeTab === 'my_requests' && (
            <div className="space-y-4">
              {/* Written Reviews */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  My Written Expert Reviews
                </h4>
                {userReviews.length === 0 ? (
                  <p className="text-xs text-stone-500 p-3 bg-stone-50 rounded-lg border border-stone-100">
                    You have not requested any written expert reviews yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {userReviews.map(r => (
                      <div
                        key={r.id}
                        className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 text-xs">
                            {r.reviewType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              r.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'Under Review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600">
                          <strong>My Query:</strong> {r.userNotes}
                        </p>

                        {r.expertFeedback && (
                          <div className="p-3 bg-white rounded-lg border border-emerald-200/80 mt-2 space-y-1">
                            <span className="text-[11px] font-bold text-emerald-800 block">
                              ✓ Clinical Dietitian Observations:
                            </span>
                            <p className="text-xs text-stone-800 leading-relaxed">
                              {r.expertFeedback}
                            </p>
                            <span className="text-[10px] text-stone-400 block text-right">
                              Reviewed on: {r.reviewedDate}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consultation Bookings */}
              <div className="pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  My 30-Minute Consultations
                </h4>
                {userConsultations.length === 0 ? (
                  <p className="text-xs text-stone-500 p-3 bg-stone-50 rounded-lg border border-stone-100">
                    No scheduled consultation calls.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userConsultations.map(c => (
                      <div
                        key={c.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs">
                              30-Min Session: {c.date}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                              {c.status}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 mt-0.5 block">
                            Slot: {c.timeSlot} · Goal: {c.goal}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Human dietitian review helps keep your fat loss safe & sustainable.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
