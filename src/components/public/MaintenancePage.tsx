import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const MaintenancePage: React.FC = () => {
  const { data, navigateTo, t } = useApp();
  const settings = data?.settings;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-[#054541]/30 blur-3xl rounded-full -z-10" />

      <div className="w-full max-w-xl rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            সাময়িক স্থগিতাদেশ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.maintenance.title}
          </h1>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {settings?.maintenanceMessage || t.maintenance.desc}
        </p>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <p className="text-xs text-slate-500">
            {t.maintenance.adminNote}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('admin')}
            icon={<Lock className="w-3.5 h-3.5 text-emerald-400" />}
          >
            {t.maintenance.adminLoginBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};
