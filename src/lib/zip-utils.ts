import JSZip from 'jszip';
import { generateScripts, formatName } from './course-utils';
import type { Course, StructureConfig } from './course-utils';
import { generateFileContent } from '@/ai/flows/generate-content-flow';

export const generateZip = async (course: Course, config: StructureConfig): Promise<Blob> => {
  const zip = new JSZip();

  const filesPerTopic = config.filesInTopic.split(',').map(f => f.trim()).filter(Boolean);

  for (const section of course) {
    const sectionDirName = formatName(config.sectionDirFormat, { index: section.index, title: section.title });
    const sectionFolder = zip.folder(sectionDirName);
    if (sectionFolder) {
      for (const topic of section.topics) {
        const topicDirName = formatName(config.topicDirFormat, { index: topic.index, title: topic.title, section_index: section.index, section_title: section.title });
        const topicFolder = sectionFolder.folder(topicDirName);
        if (topicFolder) {
          for (const file of filesPerTopic) {
            let content = '';
            if (config.aiContentEnabled) {
              try {
                const result = await generateFileContent({
                  topicTitle: topic.title,
                  fileName: file,
                });
                content = result.content;
              } catch (e) {
                console.error(`AI content generation failed for ${file}:`, e);
                content = `// AI content generation failed for this file.`;
              }
            }
            topicFolder.file(file, content);
          }
        }
      }
    }
  }

  const scripts = generateScripts(course, config);
  zip.file('create_structure.sh', scripts.bash, { unixPermissions: "755" });
  zip.file('create_structure.cmd', scripts.cmd);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
};
