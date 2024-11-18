import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const data = await req.json();
    const { url, languages } = data;

    // Fetch the content from the URL
    const response = await fetch(url);
    const articleContent = await response.text();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      systemInstruction: `Translate the following news article to the languages mentioned above. Give output in JSON with the key being the language (in lowercase) and its value being the translated text.`,
    });

    const result = await model.generateContent([
      {
        text: articleContent,
      },
      languages.join(', '), // Pass the languages as a comma-separated string
    ]);

    const responseText =  result.response.text();
    // console.log(result)
    // console.log("HERERERERER22222222222");
    // console.log(result.response);
    // console.log("HERERERERER")
    // console.log(responseText)
    // console.log("sadfasdfsadf")
    // console.log(extractJsonFromString(responseText));
    const responseText2 = extractJsonFromString(responseText);
    // Parse the response text as JSON before sending
    const parsedResponse = responseText2;//= JSON.parse(responseText2);
    
    return NextResponse.json({ model_response: parsedResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

function extractJsonFromString(inputString) {
  const jsonString = inputString.match(/({.*})/s); // Use regex to extract the JSON part
  if (jsonString && jsonString[0]) {
    try {
      return JSON.parse(jsonString[0]); // Parse the extracted JSON string
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null; // Return null if parsing fails
    }
  }
  return null; // Return null if no JSON found
}