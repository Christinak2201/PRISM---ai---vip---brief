import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { BriefRequestSchema, VipBriefSchema } from "@/lib/brief";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";

// Claude can take several seconds to write a brief; give the function room on Vercel.
export const maxDuration = 60;

const MODEL = "claude-opus-5";

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  // Read only on the server. This value never reaches the browser.
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set.");
    return errorResponse("The server is missing its AI configuration.", 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const parsedInput = BriefRequestSchema.safeParse(body);
  if (!parsedInput.success) {
    const firstIssue = parsedInput.error.issues[0];
    return errorResponse(firstIssue?.message ?? "Invalid input.", 400);
  }

  const client = new Anthropic();

  try {
    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      output_config: {
        effort: "medium",
        format: betaZodOutputFormat(VipBriefSchema),
      },
      // If a safety classifier declines, the API retries on a fallback model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(parsedInput.data) }],
    });

    if (response.stop_reason === "refusal") {
      return errorResponse(
        "The AI declined to generate this brief. Please review the information and try again.",
        422,
      );
    }

    if (!response.parsed_output) {
      console.error("Brief could not be parsed. stop_reason:", response.stop_reason);
      return errorResponse("The AI returned an incomplete brief. Please try again.", 502);
    }

    return Response.json({ brief: response.parsed_output, model: response.model });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic rejected the API key.");
      return errorResponse("The server's AI credentials are invalid.", 500);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return errorResponse("PRISM is busy right now. Please wait a moment and try again.", 429);
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${error.status}:`, error.message);
      return errorResponse("The AI service returned an error. Please try again.", 502);
    }
    console.error("Unexpected error generating brief:", error);
    return errorResponse("Something went wrong generating the brief.", 500);
  }
}
