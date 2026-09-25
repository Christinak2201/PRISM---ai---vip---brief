# PRISM – AI VIP Brief Generator

PRISM helps luxury PR professionals prepare for events. Enter what you know about a
journalist, influencer, celebrity, stylist or VIP client, click **Generate VIP Brief**,
and Claude (Anthropic) returns a structured brief:

- Name
- Role or Media Outlet
- Relationship History
- Event Relevance
- Key Notes
- Missing Information
- Recommended PR Action

The model is instructed to flag missing information explicitly rather than invent it.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Anthropic Claude API, called only from a server-side Next.js route
- Deployed on Vercel

Supabase is not used: the app does not need persistent data.

## Local setup

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Security

The Anthropic API key is read only on the server (`process.env.ANTHROPIC_API_KEY`) and is
never exposed to client code. Locally it lives in `.env.local` (gitignored). In
production it is stored in Vercel environment variables.
