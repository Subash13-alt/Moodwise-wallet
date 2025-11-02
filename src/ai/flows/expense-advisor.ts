'use server';

/**
 * @fileOverview A flow for providing personalized financial advice based on expense questions.
 *
 * - getPersonalizedExpenseAdvice - A function that generates financial advice based on conversation history.
 * - PersonalizedExpenseAdviceInput - The input type for the getPersonalizedExpenseAdvice function.
 * - PersonalizedExpenseAdviceOutput - The return type for the getPersonalizedExpenseAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedExpenseAdviceInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history between the user and the AI.'),
});
export type PersonalizedExpenseAdviceInput = z.infer<
  typeof PersonalizedExpenseAdviceInputSchema
>;

const PersonalizedExpenseAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice based on the conversation.'),
});
export type PersonalizedExpenseAdviceOutput = z.infer<
  typeof PersonalizedExpenseAdviceOutputSchema
>;

export async function getPersonalizedExpenseAdvice(
  input: PersonalizedExpenseAdviceInput
): Promise<PersonalizedExpenseAdviceOutput> {
  return personalizedExpenseAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedExpenseAdvicePrompt',
  input: {schema: PersonalizedExpenseAdviceInputSchema},
  output: {schema: PersonalizedExpenseAdviceOutputSchema},
  prompt: `You are a friendly and helpful financial advisor. Your goal is to analyze the user's expense-related questions and provide concise, helpful advice. Analyze the provided conversation history to understand the context.

Conversation History:
{{#each history}}
  {{role}}: {{content}}
{{/each}}

Based on the last user message, provide a helpful and non-judgmental response. If the user provides amounts, you can do some basic analysis.
`,
});

const personalizedExpenseAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedExpenseAdviceFlow',
    inputSchema: PersonalizedExpenseAdviceInputSchema,
    outputSchema: PersonalizedExpenseAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
