import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { ReadingProgressBar } from "@/components/site/ReadingProgressBar";
import { BackToTopButton } from "@/components/site/BackToTopButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <ReadingProgressBar />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <BackToTopButton />
    </div>
  );
}
