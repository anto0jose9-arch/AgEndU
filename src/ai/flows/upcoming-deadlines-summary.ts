'use server';

/**
 * @fileOverview Summarizes upcoming deadlines, grouping them by day and prioritizing by urgency.
 *
 * - summarizeUpcomingDeadlines - A function that summarizes upcoming deadlines.
 * - UpcomingDeadlinesInput - The input type for the summarizeUpcomingDeadlines function.
 * - UpcomingDeadlinesOutput - The return type for the summarizeUpcomingDeadlines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpcomingDeadlinesInputSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string(),
        dueDate: z.string().describe('The due date of the task in ISO format'),
        priority: z.enum(['high', 'medium', 'low']),
      })
    )
    .describe('A list of tasks with their due dates and priorities.'),
  includePlannedDates: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether to include planned dates in the summary.'),
});

export type UpcomingDeadlinesInput = z.infer<typeof UpcomingDeadlinesInputSchema>;

const UpcomingDeadlinesOutputSchema = z.object({
  summary: z.string().describe('A summary of upcoming deadlines grouped by day and prioritized by urgency.'),
});

export type UpcomingDeadlinesOutput = z.infer<typeof UpcomingDeadlinesOutputSchema>;

export async function summarizeUpcomingDeadlines(
  input: UpcomingDeadlinesInput
): Promise<UpcomingDeadlinesOutput> {
  return upcomingDeadlinesSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'upcomingDeadlinesSummaryPrompt',
  input: {
    schema: UpcomingDeadlinesInputSchema,
  },
  output: {
    schema: UpcomingDeadlinesOutputSchema,
  },
  prompt: `You are a personal assistant who summarizes upcoming deadlines.

  The current date is {{now}}.

  Here is a list of tasks:
  {{#each tasks}}
  - {{title}} (Due: {{dueDate}}, Priority: {{priority}})
  {{/each}}

  {{#if includePlannedDates}}
  Also include planned dates in the summary, sorted chronologically.
  {{/if}}

  Summarize the upcoming deadlines, grouping them by day and prioritizing by urgency. Focus on what's most important first.
  Make it actionable and easy to understand, focusing on what needs to be done.
  Be concise.  If there are no tasks, return 'No upcoming deadlines'.

  Pay special attention to generating output that conforms to the JSON schema for UpcomingDeadlinesOutput.
  `,
});

const upcomingDeadlinesSummaryFlow = ai.defineFlow(
  {
    name: 'upcomingDeadlinesSummaryFlow',
    inputSchema: UpcomingDeadlinesInputSchema,
    outputSchema: UpcomingDeadlinesOutputSchema,
  },
  async input => {
    const now = new Date().toISOString().slice(0, 10);
    const {output} = await prompt({...input, now});
    return output!;
  }
);
