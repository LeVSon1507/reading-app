import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const api = new OpenAI({
  apiKey: process.env.MY_LLM_KEY as string,
  baseURL: "https://api.aimlapi.com/v1",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const systemPrompt =
      "You are a document analysis AI. Analyze the content, extract key points, and provide a summary.";
    console.log("Request payload:", {
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `content file: ${body.content} and filename: ${body.fileName}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    if (!body.fileName || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing fileName or content in request body.",
        },
        { status: 400 }
      );
    }

    const completion = await api.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `content file: ${body.content} and filename: ${body.fileName}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      analysis: response,
    });
  } catch (error) {
    if (error.status === 429) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
