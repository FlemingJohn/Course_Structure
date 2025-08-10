import JSZip from 'jszip';
import { generateScripts, formatName } from './course-utils';
import type { Course, StructureConfig } from './course-utils';

export const generateZip = async (course: Course, config: StructureConfig): Promise<Blob> => {
  const zip = new JSZip();

  const filesPerTopic = config.filesInTopic.split(',').map(f => f.trim()).filter(Boolean);

  course.forEach(section => {
    const sectionDirName = formatName(config.sectionDirFormat, { index: section.index, title: section.title });
    const sectionFolder = zip.folder(sectionDirName);
    if (sectionFolder) {
        section.topics.forEach(topic => {
            const topicDirName = formatName(config.topicDirFormat, { index: topic.index, title: topic.title, section_index: section.index, section_title: section.title });
            const topicFolder = sectionFolder.folder(topicDirName);
            if (topicFolder) {
                filesPerTopic.forEach(file => {
                    topicFolder.file(file, '');
                });
            }
        });
    }
  });

  const scripts = generateScripts(course, config);
  zip.file('create_structure.sh', scripts.bash, { unixPermissions: "755" });
  zip.file('create_structure.cmd', scripts.cmd);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
};
