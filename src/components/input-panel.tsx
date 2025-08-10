'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { parseTimestamps } from '@/lib/course-utils';
import type { Course, StructureConfig } from '@/lib/course-utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, Settings } from 'lucide-react';

interface InputPanelProps {
  setCourse: (course: Course | null) => void;
  config: Omit<StructureConfig, 'filesInTopic'>;
  setConfig: (config: Omit<StructureConfig, 'filesInTopic'>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const formSchema = z.object({
  timestamps: z.string().min(1, 'Timestamps cannot be empty.'),
});

export function InputPanel({ setCourse, config, setConfig, isLoading, setError }: InputPanelProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timestamps: '',
    },
  });

  const handleParse = (values: z.infer<typeof formSchema>) => {
    try {
      const parsedCourse = parseTimestamps(values.timestamps);
      if (parsedCourse.length === 0) {
        throw new Error("Couldn't find any sections or topics. Check the format.");
      }
      setCourse(parsedCourse);
      setError(null);
      toast({
        title: 'Success!',
        description: 'Timestamps parsed and structure generated.',
      });
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

  return (
    <Card className="bg-card rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">1. Input & Configure</CardTitle>
        <CardDescription>Enter your course timestamps and configure the output structure.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleParse)} className="space-y-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
