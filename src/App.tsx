import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from '@/data/DataContext';
import { ToastProvider } from '@/components/ui/Toast';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage, SignupPage, ForgotPasswordPage, OnboardingPage } from '@/pages/AuthPages';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { AIStudioPage } from '@/pages/dashboard/AIStudioPage';
import { AnalyzerPage } from '@/pages/dashboard/AnalyzerPage';
import { LibraryPage } from '@/pages/dashboard/LibraryPage';
import { CalendarPage } from '@/pages/dashboard/CalendarPage';
import { VisualStudioPage } from '@/pages/dashboard/VisualStudioPage';
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage';
import { BrandHubPage } from '@/pages/dashboard/BrandHubPage';
import { CampaignsPage } from '@/pages/dashboard/CampaignsPage';
import { SocialAccountsPage } from '@/pages/dashboard/SocialAccountsPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  AdminOverviewPage, AdminUsersPage, AdminSubscriptionsPage,
  AdminAnalyticsPage, AdminSupportPage, AdminAnnouncementsPage,
  AdminActivityPage, AdminSettingsPage,
} from '@/pages/admin/AdminPages';
import { type ReactNode, useEffect } from 'react';

function RequireAuth({ children, role = 'customer' }: { children: ReactNode; role?: 'customer' | 'owner' }) {
  const { currentUser, loginAsDemo } = useData();

  useEffect(() => {
    if (!currentUser) {
      loginAsDemo(role);
    } else if (role === 'owner' && currentUser.role !== 'owner') {
      loginAsDemo('owner');
    } else if (role === 'customer' && currentUser.role === 'owner') {
      loginAsDemo('customer');
    }
  }, [currentUser, loginAsDemo, role]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cobalt-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-ink/50 font-mono">Launching workspace...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/onboarding" element={<RequireAuth><OnboardingPage /></RequireAuth>} />

      {/* Customer dashboard */}
      <Route path="/app" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route index element={<OverviewPage />} />
        <Route path="ai-studio" element={<AIStudioPage />} />
        <Route path="analyzer" element={<AnalyzerPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="visual-studio" element={<VisualStudioPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="brand-hub" element={<BrandHubPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="social-accounts" element={<SocialAccountsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Admin panel */}
      <Route path="/admin" element={<RequireAuth role="owner"><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="support" element={<AdminSupportPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
        <Route path="activity" element={<AdminActivityPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ToastProvider>
    </DataProvider>
  );
}

export default App;
