'use server';

/**
 * @fileOverview This file defines a Genkit flow to automatically fetch timestamps from a YouTube video.
 *
 * - autoFetchTimestamps - A function that initiates the process of fetching timestamps from a YouTube video.
 * - AutoFetchTimestampsInput - The input type for the autoFetchTimestamps function.
 * - AutoFetchTimestampsOutput - The return type for the autoFetchTimestamps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoFetchTimestampsInputSchema = z.object({
  youtubeVideoUrl: z
    .string()
    .describe('The URL of the YouTube video to fetch timestamps from.'),
});
export type AutoFetchTimestampsInput = z.infer<typeof AutoFetchTimestampsInputSchema>;

const AutoFetchTimestampsOutputSchema = z.object({
  timestamps: z.string().describe('The extracted timestamps from the YouTube video.'),
});
export type AutoFetchTimestampsOutput = z.infer<typeof AutoFetchTimestampsOutputSchema>;

export async function autoFetchTimestamps(input: AutoFetchTimestampsInput): Promise<AutoFetchTimestampsOutput> {
  return autoFetchTimestampsFlow(input);
}

const autoFetchTimestampsPrompt = ai.definePrompt({
  name: 'autoFetchTimestampsPrompt',
  input: {schema: AutoFetchTimestampsInputSchema},
  output: {schema: AutoFetchTimestampsOutputSchema},
  prompt: `You are an AI assistant designed to extract timestamps from YouTube video transcripts.

  Given the URL of a YouTube video, analyze the video transcript and extract all timestamps along with their corresponding descriptions.

  YouTube Video URL: {{{youtubeVideoUrl}}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const autoFetchTimestampsFlow = ai.defineFlow(
  {
    name: 'autoFetchTimestampsFlow',
    inputSchema: AutoFetchTimestampsInputSchema,
    outputSchema: AutoFetchTimestampsOutputSchema,
  },
  async input => {
    const {output} = await autoFetchTimestampsPrompt(input);
    return output!;
  }
);
