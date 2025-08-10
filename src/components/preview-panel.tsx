
'use client';

import { useState } from 'react';
import type { Course, StructureConfig } from '@/lib/course-utils';
import { generateScripts, formatName } from '@/lib/course-utils';
import { generateZip } from '@/lib/zip-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Folder, File, Download, Loader2, Code, Terminal, AlertTriangle, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreviewPanelProps {
  course: Course | null;
  setCourse: (course: Course) => void;
  config: StructureConfig;
  error: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function PreviewPanel({ course, setCourse, config, error, isLoading, setIsLoading }: PreviewPanelProps) {
  const [isZipping, setIsZipping] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (type: 'zip' | 'bash' | 'cmd') => {
    if (!course) return;

    if (type === 'zip') {
      setIsZipping(true);
      try {
        const blob = await generateZip(course, config);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'course_structure.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: 'Download complete!',
          description: 'Your zip file has been downloaded.',
        });
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Error generating zip',
          description: e.message,
        });
      } finally {
        setIsZipping(false);
      }
    } else {
      const scripts = generateScripts(course, config);
      const content = type === 'bash' ? scripts.bash : scripts.cmd;
      const fileExtension = type === 'bash' ? 'sh' : 'cmd';
      const mimeType = 'text/plain';
      
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `create_structure.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Parsing timestamps...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-destructive">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">An Error Occurred</p>
          <p className="text-center">{error}</p>
        </div>
      );
    }

    if (!course) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p className="text-lg text-center">Your generated directory structure will appear here.</p>
        </div>
      );
    }
    
    return (
      <ScrollArea className="h-full">
        <div className="p-1 pr-4">
        <ul className="space-y-2 text-sm">
          {course.map((section, sectionIndex) => (
            <li key={section.title + sectionIndex}>
              <div className="flex items-center">
                <Folder className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <span className="font-bold">{formatName(config.sectionDirFormat, { index: section.index, title: section.title })}</span>
              </div>
              <ul className="pl-6 mt-1 space-y-1 border-l border-border ml-2">
                {section.topics.map((topic, topicIndex) => {
                  const filesPerTopic = (topic.files || '').split(',').map(f => f.trim()).filter(Boolean);
                  return (
                  <li key={topic.title + topicIndex}>
                     <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                      <span>{formatName('{index_padded}. {title}', { index: topic.index, title: topic.title, section_index: section.index, section_title: section.title })}</span>
                    </div>
                    <div className="pl-6 mt-2 space-y-2 border-l border-border ml-2">
                      <ul className="pl-1 space-y-1">
                          {filesPerTopic.map(file => (
                            <li key={file} className="flex items-center">
                              <File className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground text-xs font-mono">{file}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </li>
                )})}
              </ul>
            </li>
          ))}
        </ul>
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="bg-card rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] h-full min-h-[580px] lg:min-h-0">
      <CardHeader>
         <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-2xl">2. Preview & Download</CardTitle>
              <CardDescription>Review the generated structure and download the files.</CardDescription>
            </div>
          </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-150px)]">
        <div className="flex-grow bg-background/50 rounded-lg p-4 min-h-[200px] max-h-[400px]">
          {isZipping ? (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg">Generating zip file...</p>
            </div>
          ) : renderContent()}
        </div>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full" disabled={!course || isLoading || isZipping}>
                {isZipping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download Options
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem onClick={() => handleDownload('zip')} disabled={isZipping}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download .zip archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('bash')}>
                <Terminal className="mr-2 h-4 w-4" />
                <span>Generate .sh script</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('cmd')}>
                <Code className="mr-2 h-4 w-4" />
                <span>Generate .cmd script</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
