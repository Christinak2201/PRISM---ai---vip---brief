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

## How the AI call works

- `src/app/api/generate-brief/route.ts`: server-side `POST` route. Validates the input,
  calls Claude through the official Anthropic SDK, and returns the brief as JSON.
- `src/lib/prompt.ts`: system prompt. Instructs Claude to use only the information
  provided, write "Not provided" for empty sections, and list gaps under Missing Information.
- `src/lib/brief.ts`: Zod schemas for the form input and the brief. The brief schema is sent
  to the API as a structured output format, so the response always has the seven sections.
