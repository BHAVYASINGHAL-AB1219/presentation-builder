/**
 * Flux.1 Client Wrapper (via Fireworks API)
 * Server-side only — handles Image Generation requests.
 */

const getApiKey = () => {
  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FIREWORKS_API_KEY environment variable is required. Set it in .env.local"
    );
  }
  return apiKey;
};

/**
 * Generate an image using Flux.1 [schnell] via Fireworks API.
 * @param {string} prompt - The image description prompt.
 * @returns {string} - The base64 representation of the generated image.
 */
export async function generateImage(prompt) {
  const apiKey = getApiKey();

  const res = await fetch("https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "image/jpeg"
    },
    body: JSON.stringify({
      prompt: prompt,
      aspect_ratio: "16:9"
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Flux.1 generation failed: ${res.status} ${errorText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  
  return `data:image/jpeg;base64,${base64}`;
}
