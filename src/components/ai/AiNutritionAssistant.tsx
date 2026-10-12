import React, { useState } from 'react';
import { UserProfile, DailyLog } from '../../types';
import { askAiNutritionAssistant } from '../../services/apiService';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface AiNutritionAssistantProps {
  userProfile: UserProfile;
  dailyLog: DailyLog;
}

export const AiNutritionAssistant: React.FC<AiNutritionAssistantProps> = ({
  userProfile,
  dailyLog,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `Namaste ${userProfile.name}! I am your HealthArogyaa Nutrition Advisor. 
Remember: "Know your food. Choose your meal. Build your day."
Ask me about Indian food swaps, portion adjustments, or managing cravings while staying in your ${userProfile.dailyCalories} kcal budget.`,
    },
  ]);

  const handleSend = async () => {
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    const consumedKcal = [
      ...dailyLog.breakfast,
      ...dailyLog.lunch,
      ...dailyLog.dinner,
      ...dailyLog.snacks,
    ].reduce((acc, curr) => acc + curr.calories, 0);

    const reply = await askAiNutritionAssistant(userText, userProfile, {
      consumed: consumedKcal,
      remaining: Math.max(0, userProfile.dailyCalories - consumedKcal),
    });

    setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 bg-stone-900 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg border border-stone-700 hover:bg-stone-800 transition-all flex items-center gap-2 group"
          title="Ask Nutrition AI"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline">Ask Nutrition AI</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[480px]">
          {/* Header */}
          <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold font-display">HealthArogyaa Advisor</h4>
                <p className="text-[10px] text-stone-400">Indian Meal & Portion Guidance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-stone-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-stone-900 text-white font-medium rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 shadow-2xs rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-2.5 bg-white text-stone-500 rounded-xl border border-stone-200 flex items-center gap-2 text-[11px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>Checking Indian nutrition guidelines...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-stone-100 border-t border-stone-200 flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap">
            <button
              onClick={() => setInputQuery('What can I swap evening chai biscuits with?')}
              className="px-2 py-1 bg-white border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50"
            >
              Chai biscuit swap
            </button>
            <button
              onClick={() => setInputQuery('How many rotis should I eat for dinner?')}
              className="px-2 py-1 bg-white border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50"
            >
              Dinner roti limit
            </button>
            <button
              onClick={() => setInputQuery('Best high-protein Indian breakfast without paneer?')}
              className="px-2 py-1 bg-white border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50"
            >
              No-paneer breakfast
            </button>
          </div>

          {/* Input box */}
          <div className="p-2.5 border-t border-stone-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about meals or calories..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputQuery.trim()}
              className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
