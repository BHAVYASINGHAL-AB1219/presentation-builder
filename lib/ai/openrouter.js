/**
 * OpenRouter Client Wrapper
 * Server-side only — handles OpenRouter API calls with JSON enforcement and streaming.
 * Using Alpha Owl model.
 */

const getApiKey = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY environment variable is required. Set it in .env.local"
    );
  }
  return apiKey;
};

function extractJson(text) {
  // Sometimes models wrap JSON in markdown blocks even with json_object format
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  // Try to find the first { and last }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  return text;
}

/**
 * Generate structured JSON from OpenRouter with a given system prompt and schema.
 * @param {string} systemPrompt - The system instruction
 * @param {string} userPrompt - The user's message
 * @param {object} responseSchema - Standard JSON schema
 * @returns {object} Parsed JSON response
 */
export async function generateStructured(
  systemPrompt,
  userPrompt,
  responseSchema
) {
  const apiKey = getApiKey();
  
  const fullSystemPrompt = `${systemPrompt}\n\nYou MUST return your response as a raw, valid JSON object matching this exact schema. Do not include markdown formatting or explanations.\n\nSCHEMA:\n${JSON.stringify(responseSchema, null, 2)}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "DeckAI"
    },
    body: JSON.stringify({
      model: "openrouter/owl-alpha",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: fullSystemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API Error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const textContent = data.choices[0].message.content;
  
  try {
    const cleanJson = extractJson(textContent);
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Failed to parse OpenRouter JSON:", textContent);
    throw new Error("Invalid JSON returned from model");
  }
}

/**
 * Stream structured JSON from OpenRouter.
 * Yields raw text chunks as they arrive.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} responseSchema
 * @yields {string} Text chunks
 */
export async function* streamStructured(
  systemPrompt,
  userPrompt,
  responseSchema
) {
  const apiKey = getApiKey();

  const fullSystemPrompt = `${systemPrompt}\n\nYou MUST return your response as a raw, valid JSON object matching this exact schema. Do not include markdown formatting or explanations.\n\nSCHEMA:\n${JSON.stringify(responseSchema, null, 2)}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "DeckAI",
      "Accept": "text/event-stream"
    },
    body: JSON.stringify({
      model: "openrouter/owl-alpha",
      stream: true,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: fullSystemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter Streaming API Error: ${res.status} ${err}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        try {
          const payload = JSON.parse(line.substring(6));
          const delta = payload.choices[0].delta.content || "";
          accumulated += delta;
          yield { chunk: delta, accumulated };
        } catch (err) {
          // Ignore parse errors on partial chunks
        }
      }
    }
  }
}
