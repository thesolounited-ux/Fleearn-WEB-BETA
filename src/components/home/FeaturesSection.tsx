import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  Users,
  ShieldCheck,
  Zap,
  Smartphone,
  BellRing,
  Lock,
  Sparkles,
  CreditCard,
  Key,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const { data, t } = useApp();

  const iconMap: Record<string, any> = {
    Coins,
    Users,
    ShieldCheck,
    Zap,
    Smartphone,
    BellRing,
    Lock,
    Sparkles,
    CreditCard,
    Key,
  };

  const features = data?.features || [];

  return (
    <section className="py-20 md:py-24 border-b border-slate-900 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            উদ্ভাবন ও সুবিধা
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.sections.featuresTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t.sections.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const IconComponent = iconMap[item.iconName] || ShieldCheck;

            return (
              <div
                key={item.id}
                className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-emerald-600/50 hover:bg-slate-900 transition-all duration-300 shadow-lg relative overflow-hidden"
              >
                {/* Subtle depth gradient glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#054541]/10 rounded-full blur-2xl group-hover:bg-[#054541]/25 transition-all" />

                <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 text-emerald-400 group-hover:text-white group-hover:bg-[#054541] flex items-center justify-center transition-all duration-300 shadow-inner mb-5">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
