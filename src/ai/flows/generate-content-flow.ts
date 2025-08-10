'use server';
/**
 * @fileOverview An AI flow for generating starter content for course files.
 *
 * - generateFileContent - A function that generates file content based on a topic and filename.
 * - GenerateFileContentInput - The input type for the generateFileContent function.
 * - GenerateFileContentOutput - The return type for the generateFileContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFileContentInputSchema = z.object({
  topicTitle: z.string().describe('The title of the course topic.'),
  fileName: z.string().describe('The name of the file to generate content for.'),
});
export type GenerateFileContentInput = z.infer<typeof GenerateFileContentInputSchema>;

const GenerateFileContentOutputSchema = z.object({
  content: z.string().describe('The generated content for the file.'),
});
export type GenerateFileContentOutput = z.infer<typeof GenerateFileContentOutputSchema>;

export async function generateFileContent(input: GenerateFileContentInput): Promise<GenerateFileContentOutput> {
  return generateFileContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFileContentPrompt',
  input: {schema: GenerateFileContentInputSchema},
  output: {schema: GenerateFileContentOutputSchema},
  prompt: `You are an expert programmer and teacher. Your task is to generate simple, helpful starter content for a file within a course project.

The topic is: "{{topicTitle}}"
The file is: "{{fileName}}"

Based on the file extension and the topic, create a small, relevant code snippet or markdown content.

- For markdown files (.md), create a title and a brief note.
- For Python files (.py), create a simple "Hello, World!" style print statement.
- For JavaScript files (.js), create a simple console.log statement.
- For HTML files (.html), create a basic HTML structure with a title.
- For other file types, just add a comment indicating the topic.

Keep the content very concise.`,
});

const generateFileContentFlow = ai.defineFlow(
  {
    name: 'generateFileContentFlow',
    inputSchema: GenerateFileContentInputSchema,
    outputSchema: GenerateFileContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
