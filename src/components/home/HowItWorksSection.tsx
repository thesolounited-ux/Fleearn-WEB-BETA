import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Sparkles, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const HowItWorksSection: React.FC = () => {
  const { data, navigateTo, t } = useApp();

  const iconMap: Record<string, any> = {
    UserCheck,
    Sparkles,
    TrendingUp,
    Wallet,
  };

  const steps = data?.howItWorks || [];

  return (
    <section className="py-20 md:py-24 border-b border-slate-900 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            ব্যবহারের সহজ নিয়মাবলী
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.sections.howItWorksTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t.sections.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const IconComp = iconMap[step.iconName] || Sparkles;

            return (
              <div
                key={step.id}
                className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-600/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#054541] to-[#032b29] border border-[#0d6b63]/40 text-emerald-300 flex items-center justify-center shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-700/60 font-mono">
                      0{step.stepNumber || idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  ধাপ ০{step.stepNumber || idx + 1} সম্পন্ন করুন
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigateTo('download')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            এখনই ফ্লিআর্ন অ্যাপে যুক্ত হোন
          </Button>
        </div>
      </div>
    </section>
  );
};
