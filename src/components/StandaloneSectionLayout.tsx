import { ReactNode } from 'react';
import { AppView } from '../types';

interface StandaloneSectionLayoutProps {
  currentView?: AppView;
  title?: string;
  subtitle?: string;
  badge?: string;
  onNavigate?: (view: AppView) => void;
  onOpenBooking?: () => void;
  children: ReactNode;
}

export default function StandaloneSectionLayout({
  children
}: StandaloneSectionLayoutProps) {
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {children}
    </div>
  );
}
