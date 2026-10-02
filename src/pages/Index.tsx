import { useState } from "react";
import SiteNav from "@/components/homepage/SiteNav";
import Hero from "@/components/homepage/Hero";
import Diagnosis from "@/components/homepage/Diagnosis";
import Offer from "@/components/homepage/Offer";
import Process from "@/components/homepage/Process";
import Pivot from "@/components/homepage/Pivot";
import AcquisitionFilm from "@/components/homepage/AcquisitionFilm";
import LeadGenSystem from "@/components/homepage/LeadGenSystem";
import FoundingProgram from "@/components/homepage/FoundingProgram";
import Operator from "@/components/homepage/Operator";
import Faq from "@/components/homepage/Faq";
import FinalClose from "@/components/homepage/FinalClose";
import SiteFooter from "@/components/homepage/SiteFooter";
import PreviewDialog from "@/components/homepage/PreviewDialog";
import WebsiteTransformation from "@/components/website-transformation/WebsiteTransformation";
import { C } from "@/components/homepage/tokens";

// Revora homepage -- the website chapter (Phase 2): nav, hero, find-vs-
// choose diagnosis, the approved website transformation (pinned), the
// website offer, how it works, the chapter pivot into lead generation, and
// the rendered acquisition film (Phase 3A), the system behind the film and
// the Founding Client Program (Phase 3B), then operator credibility, FAQ,
// the final close and footer (Phase 4). Previous homepage components (components/home/*,
// components/cinematic/*, homepage/TransformationStage) remain unused here.
const Index = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const openPreview = () => setPreviewOpen(true);

  return (
    <div className="min-h-screen font-sans antialiased [&_section[id]]:scroll-mt-[88px]" style={{ background: C.navy, color: C.text }}>
      <SiteNav />
      <main>
        <Hero onPrimary={openPreview} />
        <Diagnosis />
        <WebsiteTransformation
          id="websites"
          sub="We rebuild how your business presents itself online, so the first impression matches the work."
        />
        <Offer onPrimary={openPreview} />
        <Process onPrimary={openPreview} />
        <Pivot />

        <AcquisitionFilm />
        <LeadGenSystem />
        <FoundingProgram />
        <Operator />
        <Faq />
        <FinalClose />
      </main>
      <SiteFooter />
      <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} />
    </div>
  );
};

export default Index;
