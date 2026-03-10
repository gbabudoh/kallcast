import { Metadata } from 'next';
import NavbarWrapper from '@/components/shared/NavbarWrapper';

export const metadata: Metadata = {
  title: 'Dashboard - KallKast',
  description: 'Your KallKast dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarWrapper />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
