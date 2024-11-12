import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
  const uploadResponse = await fileManager.uploadFile(
    "public/Ishaan_Gupta_Resume.pdf",
    {
      mimeType: "application/pdf",
      displayName: "Ishaan's Resume",
    }
  );

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      systemInstruction: `Translate the following news article to the languages mentioned above. Give output in JSON with the key being the language (in lowercase) and its value being the translated text.`,
    });
    const data = await req.json();
    const prompt = data.body;
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      prompt,
    ]);
    const response = await result.response.text();

    return NextResponse.json({ model_response: response });
  } catch (error) {
    console.error(error);
  }
}
