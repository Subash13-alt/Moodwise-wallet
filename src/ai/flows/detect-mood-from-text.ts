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
  mood: z.enum(['happy', 'sad', 'neutral', 'stressed', 'anxious', 'tired']).describe('The detected mood (happy, sad, neutral, stressed, anxious, or tired).'),
});
export type DetectMoodFromTextOutput = z.infer<typeof DetectMoodFromTextOutputSchema>;

export async function detectMoodFromText(input: DetectMoodFromTextInput): Promise<DetectMoodFromTextOutput> {
  return detectMoodFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMoodFromTextPrompt',
  input: {schema: DetectMoodFromTextInputSchema},
  output: {schema: DetectMoodFromTextOutputSchema},
  prompt: `You are a sentiment analysis expert. Your task is to determine the user's mood from the given text.
The mood must be one of the following options: happy, sad, neutral, stressed, anxious, or tired.

Analyze the following text and return only the determined mood.

Text: {{{text}}}
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
