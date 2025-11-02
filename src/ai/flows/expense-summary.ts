'use server';

/**
 * @fileOverview A flow for summarizing user expenses.
 *
 * - getExpenseSummary - A function that generates a summary of user expenses.
 * - ExpenseSummaryInput - The input type for the getExpenseSummary function.
 * - ExpenseSummaryOutput - The return type for the getExpenseSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  timeOfDay: z.string(),
  mood: z.string(),
  category: z.string(),
  amount: z.number(),
  recommendation: z.string(),
});

const ExpenseSummaryInputSchema = z.object({
  transactions: z.array(TransactionSchema),
});
export type ExpenseSummaryInput = z.infer<typeof ExpenseSummaryInputSchema>;

const ExpenseSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the user\'s expenses.'),
  totalSpent: z.number().describe('The total amount of money spent.'),
  transactionCount: z.number().describe('The total number of transactions.'),
  topCategory: z.string().describe('The category with the highest spending.'),
});
export type ExpenseSummaryOutput = z.infer<typeof ExpenseSummaryOutputSchema>;

export async function getExpenseSummary(
  input: ExpenseSummaryInput
): Promise<ExpenseSummaryOutput> {
  return expenseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expenseSummaryPrompt',
  input: { schema: ExpenseSummaryInputSchema },
  output: { schema: ExpenseSummaryOutputSchema },
  prompt: `You are a financial analyst. Analyze the following list of transactions and provide a short, insightful summary (2-3 sentences) of the user's spending habits. Also provide the total spending, total number of transactions, and the category with the highest spending. The currency is Rupees (₹).

Transactions:
{{#each transactions}}
- Date: {{date}}, Category: {{category}}, Amount: ₹{{amount}}, Mood: {{mood}}
{{/each}}
`,
});

const expenseSummaryFlow = ai.defineFlow(
  {
    name: 'expenseSummaryFlow',
    inputSchema: ExpenseSummaryInputSchema,
    outputSchema: ExpenseSummaryOutputSchema,
  },
  async (input) => {
    if (input.transactions.length === 0) {
      return {
        summary: 'No transactions available to analyze.',
        totalSpent: 0,
        transactionCount: 0,
        topCategory: 'N/A',
      };
    }
    const { output } = await prompt(input);
    return output!;
  }
);