import { AuthProvider } from "@/context/AuthContext";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorkerRegistration";

export const metadata = {
  title: "Dashboard",
  manifest: "/manifest.json",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
      <Toaster position="bottom-right" richColors closeButton />
      <ServiceWorkerRegistration />
    </AuthProvider>
  );
}
