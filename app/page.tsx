import LandingPageContent from "@/components/landing-page-content";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-br from-background to-muted py-12">
      <LandingPageContent />
    </main>
  );
}
