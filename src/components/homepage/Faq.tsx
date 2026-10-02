import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { C, CONTAINER } from "./tokens";

// FAQ: clarifies the locked offers without reproducing the agreement.
// Grouped (Websites / Lead generation) so eight answers stay easy to scan.

const GROUPS: { label: string; items: [string, string][] }[] = [
  {
    label: "Websites",
    items: [
      ["What does the $997 website include?", "A full website build: up to 5 pages, written from the information you give us, with mobile-friendly design, a contact/quote form, domain connection and basic on-page SEO setup. You get one consolidated round of revisions, then we launch it."],
      ["Why is Website Care $99/month?", "It covers your managed hosting and ongoing website maintenance, plus small updates like changing a photo, your hours or your phone number. Bigger changes, like new pages, sections or functionality, are quoted separately."],
      ["What happens if I cancel Website Care?", "Once the build is paid in full, the website is yours. If you cancel Website Care, our hosting ends and we'll give you the current site files so you can take it wherever you like. If you'd like us to set it up somewhere else, that work is quoted separately."],
    ],
  },
  {
    label: "Lead generation",
    items: [
      ["Is ad spend included in the $750?", "No. You fund your Meta ad spend directly through your own ad account, and Revora doesn't mark it up. The $750 founding rate is Revora's management fee for the first 90 days."],
      ["Do I have to spend exactly $1,500/month on ads?", "$1,500/month is the recommended starting ad budget shown on this page. We'll talk through what makes sense for your business before anything starts."],
      ["What happens after the first 90 days?", "Your management rate after the founding period is agreed upfront, in writing, before we start. No surprise rate change on day 91."],
      ["Are leads guaranteed?", "No. We don't guarantee a specific number of leads, jobs, revenue or return on ad spend. Performance depends on your business, your market, your offer and how the work is executed."],
      ["Do you work with every local service business?", "No. Founding lead-generation partnerships are subject to fit. We'll look at your business, your market and the work you want more of, and tell you if we think the economics make sense."],
    ],
  },
];

export default function Faq() {
  return (
    <section id="faq" className="relative py-24 md:py-32" style={{ background: C.ink }}>
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20`}>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.faint }}>FAQ</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em]" style={{ color: C.text }}>
            Straight answers.
          </h2>
        </div>

        <div className="space-y-12">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.orange }}>{g.label}</p>
              <Accordion type="single" collapsible className="w-full">
                {g.items.map(([q, a], i) => (
                  <AccordionItem key={q} value={`${g.label}-${i}`} style={{ borderColor: C.line }}>
                    <AccordionTrigger className="py-5 text-left text-[17px] font-medium hover:no-underline [&>svg]:text-white/50" style={{ color: C.text }}>
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-[16px] leading-[1.65]" style={{ color: C.muted }}>
                      <p className="max-w-[620px]">{a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
