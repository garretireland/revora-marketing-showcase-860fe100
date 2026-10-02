import { useEffect, useId, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CALENDLY, C } from "./tokens";
import {
  EMPTY_REQUEST, IMPROVE_MAX, mailtoFor, submitPreviewRequest, validate,
  type FieldErrors, type PreviewRequest,
} from "./previewRequest";

// "See What We'd Build For You": the lower-friction website inquiry. One
// shared dialog for every entry point. Short form, honest outcomes: the
// success state appears ONLY after submitPreviewRequest() resolves (a real
// confirmed delivery). Entered fields survive closing/reopening and any
// failed submission.

type Status = "idle" | "sending" | "sent" | "failed";

// Ring lives in classes (not inline style) so the orange focus ring can win.
const inputCls = "mt-2 w-full rounded-[8px] px-3.5 py-3 text-[15px] outline-none transition-[box-shadow] focus:shadow-[inset_0_0_0_1.5px_#FF8838]";
const ringOk = "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]";
const ringBad = "shadow-[inset_0_0_0_1px_rgba(255,120,100,0.75)]";
const inputStyle = (_bad: boolean): React.CSSProperties => ({ background: "rgba(255,255,255,0.04)", color: C.text });

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium" style={{ color: C.text }}>
        {label} {optional && <span style={{ color: C.faint }}>(optional)</span>}
      </label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-[13px]" style={{ color: "#ff9d8a" }}>{error}</p>}
    </div>
  );
}

export default function PreviewDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const uid = useId();
  const [data, setData] = useState<PreviewRequest>(EMPTY_REQUEST);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  // a completed request starts fresh the next time the dialog opens
  useEffect(() => {
    if (open && status === "sent") { setData(EMPTY_REQUEST); setErrors({}); setTried(false); setStatus("idle"); }
    // only when (re)opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (k: keyof PreviewRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...data, [k]: e.target.value };
    setData(next);
    if (tried) setErrors(validate(next));
    if (status === "failed") setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    const v = validate(data);
    setErrors(v);
    const first = Object.keys(v)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitPreviewRequest(data);
      setStatus("sent");
    } catch {
      setStatus("failed"); // fields are kept; retry or use a fallback
    }
  };

  const id = (k: string) => `${uid}-${k}`;
  const aria = (k: keyof FieldErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-err` : undefined,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92svh] max-w-lg overflow-y-auto border font-sans"
        style={{ background: C.raised, borderColor: C.line, color: C.text }}
        // don't let a stray outside click dismiss a request that's mid-flight
        onInteractOutside={(e) => { if (status === "sending") e.preventDefault(); }}
      >
        {status === "sent" ? (
          <div className="py-6">
            <DialogTitle className="font-display text-[34px] font-medium leading-tight">Got it.</DialogTitle>
            <DialogDescription className="mt-3 text-[16px] leading-relaxed" style={{ color: C.muted }}>
              We'll take a look at your business and reach out with the next step.
            </DialogDescription>
            <button type="button" onClick={() => onOpenChange(false)} className="mt-8 rounded-full px-6 py-3 text-[14px] font-semibold" style={{ color: C.text, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div>
              <DialogTitle className="font-display text-[28px] font-medium leading-tight">See what we'd build for you</DialogTitle>
              <DialogDescription className="mt-2 text-[15px] leading-relaxed" style={{ color: C.muted }}>
                Tell us a little about your business and we'll look at how your website could make you the obvious choice.
              </DialogDescription>
            </div>

            <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-2 space-y-4">
              <Field id={id("name")} label="Name" error={errors.name}>
                <input id={id("name")} name="name" autoComplete="name" value={data.name} onChange={set("name")} className={`${inputCls} ${errors.name ? ringBad : ringOk}`} style={inputStyle(!!errors.name)} required {...aria("name")} />
              </Field>
              <Field id={id("business")} label="Business name" error={errors.business}>
                <input id={id("business")} name="business" autoComplete="organization" value={data.business} onChange={set("business")} className={`${inputCls} ${errors.business ? ringBad : ringOk}`} style={inputStyle(!!errors.business)} required {...aria("business")} />
              </Field>
              <Field id={id("website")} label="Website" optional error={errors.website}>
                <input id={id("website")} name="website" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" value={data.website} onChange={set("website")} className={`${inputCls} placeholder:text-white/25 ${errors.website ? ringBad : ringOk}`} style={inputStyle(!!errors.website)} {...aria("website")} />
              </Field>
              <Field id={id("email")} label="Email" error={errors.email}>
                <input id={id("email")} name="email" type="email" autoComplete="email" value={data.email} onChange={set("email")} className={`${inputCls} ${errors.email ? ringBad : ringOk}`} style={inputStyle(!!errors.email)} required {...aria("email")} />
              </Field>
              <Field id={id("phone")} label="Phone" optional error={errors.phone}>
                <input id={id("phone")} name="phone" type="tel" autoComplete="tel" value={data.phone} onChange={set("phone")} className={`${inputCls} ${errors.phone ? ringBad : ringOk}`} style={inputStyle(!!errors.phone)} {...aria("phone")} />
              </Field>
              <Field id={id("improve")} label="What would you like to improve?" optional error={errors.improve}>
                <textarea id={id("improve")} name="improve" rows={3} maxLength={IMPROVE_MAX} value={data.improve} onChange={set("improve")} className={`${inputCls} resize-y ${errors.improve ? ringBad : ringOk}`} style={inputStyle(!!errors.improve)} {...aria("improve")} />
              </Field>

              {/* honeypot (hidden from people and assistive tech) */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>Company URL<input tabIndex={-1} autoComplete="off" name="company_url" value={data.company_url} onChange={set("company_url")} /></label>
              </div>

              {status === "failed" && (
                <div role="alert" className="rounded-[8px] px-4 py-3.5 text-[14px] leading-relaxed" style={{ background: "rgba(255,120,100,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,120,100,0.35)", color: C.text }}>
                  We couldn't send your request right now. Your details are still here. You can{" "}
                  <a href={mailtoFor(data)} className="underline underline-offset-4" style={{ color: C.orange }}>send it by email instead</a>
                  {" "}or{" "}
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: C.orange }}>book a call</a>.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-[15px] font-semibold transition-opacity disabled:opacity-60 sm:w-auto"
                style={{ background: C.orange, color: C.orangeInk }}
              >
                {status === "sending" ? "Sending…" : "Show Me What You'd Build"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
