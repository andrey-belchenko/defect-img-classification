import OpenAI from "openai";
import { openaiApiKey } from "./secret";
import { prompt } from "./prompt";

const client = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true,
});

export async function analyzeDefect(imageFile: File, classifierText: string) {
  const imageBase64 = await fileToBase64(imageFile);
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
          { type: "text", text: classifierText },
        ],
      },
    ],
  });
  console.log("AI response", response);
  return JSON.parse(response.choices[0]?.message?.content ?? "[]") as number[];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
