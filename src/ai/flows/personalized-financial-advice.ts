'use server';

/**
 * @fileOverview A flow for providing personalized financial advice based on user mood.
 *
 * - getPersonalizedFinancialAdvice - A function that generates financial advice based on mood.
 * - PersonalizedFinancialAdviceInput - The input type for the getPersonalizedFinancialAdvice function.
 * - PersonalizedFinancialAdviceOutput - The return type for the getPersonalizedFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFinancialAdviceInputSchema = z.object({
  mood: z
    .string()
    .describe('The current mood of the user (happy, sad, or neutral).'),
});
export type PersonalizedFinancialAdviceInput = z.infer<
  typeof PersonalizedFinancialAdviceInputSchema
>;

const PersonalizedFinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice based on the mood.'),
});
export type PersonalizedFinancialAdviceOutput = z.infer<
  typeof PersonalizedFinancialAdviceOutputSchema
>;

export async function getPersonalizedFinancialAdvice(
  input: PersonalizedFinancialAdviceInput
): Promise<PersonalizedFinancialAdviceOutput> {
  return personalizedFinancialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFinancialAdvicePrompt',
  input: {schema: PersonalizedFinancialAdviceInputSchema},
  output: {schema: PersonalizedFinancialAdviceOutputSchema},
  prompt: `You are a financial advisor. Based on the user's mood, provide personalized financial advice.

Mood: {{{mood}}}

Advice: `,
});

const personalizedFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedFinancialAdviceFlow',
    inputSchema: PersonalizedFinancialAdviceInputSchema,
    outputSchema: PersonalizedFinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
