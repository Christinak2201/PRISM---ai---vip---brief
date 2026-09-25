import type { VipBrief } from "@/lib/brief";

const NOT_PROVIDED = "Not provided";

function TextSection({ title, text }: { title: string; text: string }) {
  const missing = text.trim() === NOT_PROVIDED;
  return (
    <section className="border-t border-sand py-6">
      <h4 className="text-[11px] uppercase tracking-[0.25em] text-ink-soft">{title}</h4>
      <p className={`mt-3 leading-relaxed ${missing ? "italic text-ink-soft" : ""}`}>{text}</p>
    </section>
  );
}

function ListSection({
  title,
  items,
  empty,
  marker,
  accent = false,
}: {
  title: string;
  items: string[];
  empty: string;
  marker: string;
  accent?: boolean;
}) {
  return (
    <section className="border-t border-sand py-6">
      <h4
        className={`text-[11px] uppercase tracking-[0.25em] ${accent ? "text-alert" : "text-ink-soft"}`}
      >
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="mt-3 italic text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3 leading-relaxed">
              <span aria-hidden="true" className={accent ? "text-alert" : "text-ink-soft"}>
                {marker}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function BriefDisplay({ brief }: { brief: VipBrief }) {
  return (
    <article className="border border-sand bg-beige/60 px-6 py-10 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft">VIP Brief</p>
      <h3 className="mt-3 font-serif text-4xl">{brief.name}</h3>
      <p className="mt-1 font-serif text-xl italic text-ink-soft">{brief.role_or_media_outlet}</p>

      <div className="mt-8">
        <TextSection title="Relationship History" text={brief.relationship_history} />
        <TextSection title="Event Relevance" text={brief.event_relevance} />
        <ListSection
          title="Key Notes"
          items={brief.key_notes}
          empty="No key notes provided."
          marker="—"
        />
        <ListSection
          title="Missing Information"
          items={brief.missing_information}
          empty="No gaps identified."
          marker="○"
          accent
        />

        <section className="border-t border-ink pt-6">
          <h4 className="text-[11px] uppercase tracking-[0.25em]">Recommended PR Action</h4>
          <p className="mt-3 font-serif text-xl leading-relaxed">{brief.recommended_pr_action}</p>
        </section>
      </div>
    </article>
  );
}
