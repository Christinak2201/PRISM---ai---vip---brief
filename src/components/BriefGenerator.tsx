"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_CATEGORIES, type ContactCategory } from "@/lib/categories";
import type { VipBrief } from "@/lib/brief";
import BriefDisplay from "./BriefDisplay";

type FormState = {
  name: string;
  category: ContactCategory;
  roleOrOutlet: string;
  relationshipHistory: string;
  eventContext: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "Journalist",
  roleOrOutlet: "",
  relationshipHistory: "",
  eventContext: "",
  notes: "",
};

const labelClass = "block text-[11px] uppercase tracking-[0.2em] text-ink-soft";
const inputClass =
  "mt-2 w-full border-0 border-b border-sand bg-transparent px-0 py-2 text-base text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none focus:ring-0";

export default function BriefGenerator() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [brief, setBrief] = useState<VipBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setBrief(null);

    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.brief) {
        setError(data?.error ?? "The brief could not be generated. Please try again.");
        return;
      }
      setBrief(data.brief);
    } catch {
      setError("Could not reach PRISM. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setBrief(null);
    setError(null);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="font-serif text-3xl">
          Contact details
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Share what you know. PRISM will flag what is missing rather than invent it.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              required
              maxLength={200}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Camille Laurent"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Contact type
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value as ContactCategory)}
              className={inputClass}
            >
              {CONTACT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="roleOrOutlet" className={labelClass}>
              Role or media outlet
            </label>
            <input
              id="roleOrOutlet"
              maxLength={300}
              value={form.roleOrOutlet}
              onChange={(e) => update("roleOrOutlet", e.target.value)}
              placeholder="e.g. Fashion editor, Vogue Paris"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="relationshipHistory" className={labelClass}>
              Relationship history
            </label>
            <textarea
              id="relationshipHistory"
              rows={3}
              maxLength={4000}
              value={form.relationshipHistory}
              onChange={(e) => update("relationshipHistory", e.target.value)}
              placeholder="Past events attended, coverage, gifts, meetings…"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="eventContext" className={labelClass}>
              Upcoming event
            </label>
            <textarea
              id="eventContext"
              rows={2}
              maxLength={2000}
              value={form.eventContext}
              onChange={(e) => update("eventContext", e.target.value)}
              placeholder="e.g. Autumn/Winter 2026 show, Paris, 3 March"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Additional notes
            </label>
            <textarea
              id="notes"
              rows={3}
              maxLength={4000}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Preferences, sensitivities, team, anything else…"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-ivory transition hover:bg-ink/85 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Composing brief…" : "Generate VIP Brief"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-ink hover:underline disabled:opacity-60"
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      <section aria-labelledby="brief-heading" aria-live="polite" aria-busy={loading}>
        <h2 id="brief-heading" className="sr-only">
          VIP brief
        </h2>
        {error && (
          <div role="alert" className="border border-alert/40 bg-beige px-6 py-5 text-sm text-alert">
            {error}
          </div>
        )}
        {!error && loading && (
          <div className="flex min-h-80 flex-col items-center justify-center border border-sand bg-beige/60 px-6 text-center">
            <p className="font-serif text-2xl italic">Composing your brief…</p>
            <p className="mt-2 text-sm text-ink-soft">This usually takes 10–30 seconds.</p>
          </div>
        )}
        {!error && !loading && brief && <BriefDisplay brief={brief} />}
        {!error && !loading && !brief && (
          <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-sand px-6 text-center">
            <p className="font-serif text-2xl italic text-ink-soft">Your brief will appear here</p>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">
              Fill in the contact details and select Generate VIP Brief.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
