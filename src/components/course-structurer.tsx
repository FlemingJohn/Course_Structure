'use client';

import { useState } from 'react';
import type { Course, StructureConfig } from '@/lib/course-utils';
import { InputPanel } from '@/components/input-panel';
import { PreviewPanel } from '@/components/preview-panel';

export function CourseStructurer() {
  const [course, setCourse] = useState<Course | null>(null);
  const [config, setConfig] = useState<StructureConfig>({
    sectionDirFormat: '{index_padded}. {title}',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <InputPanel
        setCourse={setCourse}
        config={config}
        setConfig={setConfig}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setError={setError}
      />
      <PreviewPanel
        course={course}
        setCourse={setCourse}
        config={config}
        error={error}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
