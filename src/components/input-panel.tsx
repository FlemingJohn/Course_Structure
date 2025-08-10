'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { autoFetchTimestamps } from '@/ai/flows/auto-fetch-timestamps';
import { parseTimestamps, getYoutubeVideoId } from '@/lib/course-utils';
import type { Course, StructureConfig } from '@/lib/course-utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wand2, FileText, Loader2, Settings } from 'lucide-react';

interface InputPanelProps {
  setCourse: (course: Course | null) => void;
  config: StructureConfig;
  setConfig: (config: StructureConfig) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const formSchema = z.object({
  url: z.string(),
  timestamps: z.string(),
});

export function InputPanel({ setCourse, config, setConfig, isLoading, setIsLoading, setError }: InputPanelProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      timestamps: '',
    },
  });

  const handleParse = (text: string) => {
    try {
      if (!text.trim()) {
        throw new Error('Timestamps cannot be empty.');
      }
      const parsedCourse = parseTimestamps(text);
      if (parsedCourse.length === 0) {
        throw new Error("Couldn't find any sections or topics. Check the format.");
      }
      setCourse(parsedCourse);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setCourse(null);
      toast({
        variant: 'destructive',
        title: 'Parsing Error',
        description: e.message,
      });
    }
  };

  const handleAutoFetch = (url: string) => {
    if (!url) {
      form.setError('url', { type: 'manual', message: 'Please enter a YouTube URL.' });
      return;
    }
    const videoId = getYoutubeVideoId(url);
    if (!videoId) {
      form.setError('url', { type: 'manual', message: 'Could not extract a valid YouTube video ID from the URL.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setCourse(null);

    startTransition(async () => {
      try {
        const result = await autoFetchTimestamps({ youtubeVideoUrl: url });
        if (result.timestamps) {
          form.setValue('timestamps', result.timestamps);
          handleParse(result.timestamps);
          toast({
            title: 'Success!',
            description: 'Timestamps fetched and parsed.',
          });
        } else {
          throw new Error('AI could not fetch timestamps.');
        }
      } catch (e: any) {
        const errorMessage = e.message || 'An unknown error occurred while fetching timestamps.';
        setError(errorMessage);
        setCourse(null);
        toast({
          variant: 'destructive',
          title: 'Auto-Fetch Failed',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <Card className="bg-card rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">1. Input & Configure</CardTitle>
        <CardDescription>Provide timestamps via URL or manual entry, then configure the output.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url"><Wand2 className="mr-2 h-4 w-4" />From URL</TabsTrigger>
            <TabsTrigger value="manual"><FileText className="mr-2 h-4 w-4" />Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => handleAutoFetch(form.getValues('url')))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Course URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Fetch & Generate
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="manual" className="pt-4">
             <Form {...form}>
                <form onSubmit={form.handleSubmit(() => handleParse(form.getValues('timestamps')))} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="timestamps"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Timestamps</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Section 1&#10;00:00 - Topic 1&#10;01:23 - Topic 2"
                            className="h-32 font-mono text-sm"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        <FileText className="mr-2 h-4 w-4" />
                        Parse & Generate
                    </Button>
                </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="flex items-center font-headline text-lg"><Settings className="mr-2 h-5 w-5" />Configuration</h3>
          <div className="space-y-2">
            <Label htmlFor="section-format">Section Folder Format</Label>
            <Input
              id="section-format"
              value={config.sectionDirFormat}
              onChange={(e) => setConfig({ ...config, sectionDirFormat: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic-format">Topic Folder Format</Label>
            <Input
              id="topic-format"
              value={config.topicDirFormat}
              onChange={(e) => setConfig({ ...config, topicDirFormat: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="files-in-topic">Files per Topic (comma-separated)</Label>
            <Input
              id="files-in-topic"
              value={config.filesInTopic}
              onChange={(e) => setConfig({ ...config, filesInTopic: e.target.value })}
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
