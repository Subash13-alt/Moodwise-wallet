'use server';

/**
 * @fileOverview Detects the mood from text input and returns the detected mood.
 *
 * - detectMoodFromText - A function that handles the mood detection process from text.
 * - DetectMoodFromTextInput - The input type for the detectMoodFromText function.
 * - DetectMoodFromTextOutput - The return type for the detectMoodFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMoodFromTextInputSchema = z.object({
  text: z.string().describe('The text input describing the user\'s feelings.'),
});
export type DetectMoodFromTextInput = z.infer<typeof DetectMoodFromTextInputSchema>;

const DetectMoodFromTextOutputSchema = z.object({
  mood: z.enum(['happy', 'sad', 'neutral']).describe('The detected mood (happy, sad, or neutral).'),
});
export type DetectMoodFromTextOutput = z.infer<typeof DetectMoodFromTextOutputSchema>;

export async function detectMoodFromText(input: DetectMoodFromTextInput): Promise<DetectMoodFromTextOutput> {
  return detectMoodFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMoodFromTextPrompt',
  input: {schema: DetectMoodFromTextInputSchema},
  output: {schema: DetectMoodFromTextOutputSchema},
  prompt: `You are a sentiment analysis expert. Determine the mood (happy, sad, or neutral) of the following text:

Text: {{{text}}}

Return the mood as a JSON object.
`,
});

const detectMoodFromTextFlow = ai.defineFlow(
  {
    name: 'detectMoodFromTextFlow',
    inputSchema: DetectMoodFromTextInputSchema,
    outputSchema: DetectMoodFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
