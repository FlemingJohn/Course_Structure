'use server';
/**
 * @fileOverview An AI flow for suggesting relevant filenames for a course topic.
 *
 * - suggestFilesForTopic - A function that suggests files based on a topic title.
 * - SuggestFilesInput - The input type for the suggestFilesForTopic function.
 * - SuggestFilesOutput - The return type for the suggestFilesForTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFilesInputSchema = z.object({
  topicTitle: z.string().describe('The title of the course topic.'),
});
export type SuggestFilesInput = z.infer<typeof SuggestFilesInputSchema>;

const SuggestFilesOutputSchema = z.object({
  files: z.string().describe('A comma-separated list of suggested file names.'),
});
export type SuggestFilesOutput = z.infer<typeof SuggestFilesOutputSchema>;

export async function suggestFilesForTopic(input: SuggestFilesInput): Promise<SuggestFilesOutput> {
  return suggestFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFilesPrompt',
  input: {schema: SuggestFilesInputSchema},
  output: {schema: SuggestFilesOutputSchema},
  prompt: `You are an expert programmer and teacher. Your task is to suggest a few relevant filenames for a given course topic.

The topic is: "{{topicTitle}}"

Based on the topic, suggest 2-3 helpful starter files.
- For a React component topic, you might suggest "MyComponent.tsx, MyComponent.css".
- For a Python script topic, you might suggest "main.py, utils.py".
- For a general concept, you might suggest "notes.md".

Return the filenames as a single comma-separated string. Do not include any other text in your response.`,
});

const suggestFilesFlow = ai.defineFlow(
  {
    name: 'suggestFilesFlow',
    inputSchema: SuggestFilesInputSchema,
    outputSchema: SuggestFilesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
