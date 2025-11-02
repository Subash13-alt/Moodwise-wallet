'use server';
/**
 * @fileOverview Mood detection from image.
 *
 * - detectMoodFromImage - A function that handles mood detection from image.
 * - DetectMoodFromImageInput - The input type for the detectMoodFromImage function.
 * - DetectMoodFromImageOutput - The return type for the detectMoodFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMoodFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectMoodFromImageInput = z.infer<typeof DetectMoodFromImageInputSchema>;

const DetectMoodFromImageOutputSchema = z.object({
  mood: z
    .enum(['happy', 'sad', 'neutral', 'stressed', 'anxious', 'tired'])
    .describe('The detected mood from the image.'),
});
export type DetectMoodFromImageOutput = z.infer<typeof DetectMoodFromImageOutputSchema>;

export async function detectMoodFromImage(input: DetectMoodFromImageInput): Promise<DetectMoodFromImageOutput> {
  return detectMoodFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMoodFromImagePrompt',
  input: {schema: DetectMoodFromImageInputSchema},
  output: {schema: DetectMoodFromImageOutputSchema},
  prompt: `You are an AI that can detect the mood of a person from an image.

  Analyze the image provided and determine the mood of the person in the image. The mood can be happy, sad, neutral, stressed, anxious, or tired. Set the mood output field appropriately.

  Here is the image:
  {{media url=photoDataUri}}
  `,
});

const detectMoodFromImageFlow = ai.defineFlow(
  {
    name: 'detectMoodFromImageFlow',
    inputSchema: DetectMoodFromImageInputSchema,
    outputSchema: DetectMoodFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
