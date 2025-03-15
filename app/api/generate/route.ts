import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';


const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

   const response =  await client.images.generate({
    model: "black-forest-labs/flux-dev",
      response_format: "b64_json",
      size: "1024x1024",
      n: 1,
      prompt,
      // Pass custom parameters via API directly since they're not in the type definition
      // @ts-ignore
      extra: {
          response_extension: "webp",
          num_inference_steps: 30,
          negative_prompt: "",
          seed: -1
      }
  });
    console.log("Image generated", response.data[0].b64_json)
    return NextResponse.json({ imageUrl: `data:image/webp;base64,${response.data[0].b64_json}` });
    console.log("Image generated",response.data[0].url)
    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}