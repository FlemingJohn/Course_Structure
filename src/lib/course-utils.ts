export interface Topic {
  title: string;
  timestamp?: string;
  index: number;
}

export interface Section {
  title: string;
  topics: Topic[];
  index: number;
}

export type Course = Section[];

export interface StructureConfig {
  sectionDirFormat: string;
  topicDirFormat: string;
  filesInTopic: string;
}

export const getYoutubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const parseTimestamps = (text: string): Course => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const course: Course = [];
  let currentSection: Section | null = null;
  let sectionIndex = 0;
  let topicIndex = 0;

  const timestampRegex = /(?:(\d{1,2}:)?\d{1,2}:\d{2})/;

  for (const line of lines) {
    const timestampMatch = line.match(timestampRegex);

    if (timestampMatch) {
      if (!currentSection) {
        sectionIndex++;
        topicIndex = 0;
        currentSection = { title: `Section ${sectionIndex}`, topics: [], index: sectionIndex };
        course.push(currentSection);
      }
      topicIndex++;
      const title = line.replace(timestampRegex, '').replace(/[-–—]/, '').trim();
      currentSection.topics.push({ title, timestamp: timestampMatch[0], index: topicIndex });
    } else {
      sectionIndex++;
      topicIndex = 0;
      currentSection = { title: line.trim(), topics: [], index: sectionIndex };
      course.push(currentSection);
    }
  }

  return course;
};

export const sanitizeForFilename = (name: string): string => {
  return name.replace(/[<>:"/\\|?*]/g, '_').replace(/[\s\.]/g, '_');
};

export const formatName = (template: string, data: Record<string, string | number>): string => {
  let result = template;
  result = result.replace(/\{index_padded\}/g, String(data.index).padStart(2, '0'));
  result = result.replace(/\{index\}/g, String(data.index));
  result = result.replace(/\{title\}/g, data.title as string);
  
  if (data.section_index) {
     result = result.replace(/\{section_index_padded\}/g, String(data.section_index).padStart(2, '0'));
     result = result.replace(/\{section_index\}/g, String(data.section_index));
  }
   if (data.section_title) {
     result = result.replace(/\{section_title\}/g, data.section_title as string);
  }

  return sanitizeForFilename(result);
};


export const generateScripts = (course: Course, config: StructureConfig): { bash: string, cmd: string } => {
    let bashScript = '#!/bin/bash\n# Script to generate course structure\n\n';
    let cmdScript = '@echo off\nrem Script to generate course structure\n\n';

    const filesPerTopic = config.filesInTopic.split(',').map(f => f.trim()).filter(Boolean);

    course.forEach(section => {
        const sectionDir = formatName(config.sectionDirFormat, { index: section.index, title: section.title });
        bashScript += `mkdir -p "${sectionDir}"\n`;
        cmdScript += `mkdir "${sectionDir}"\n`;

        section.topics.forEach(topic => {
            const topicDir = formatName(config.topicDirFormat, { index: topic.index, title: topic.title, section_index: section.index, section_title: section.title });
            const fullPath = `${sectionDir}/${topicDir}`;
            bashScript += `mkdir -p "${fullPath}"\n`;
            cmdScript += `mkdir "${fullPath.replace(/\//g, '\\')}"\n`;

            filesPerTopic.forEach(file => {
                bashScript += `touch "${fullPath}/${file}"\n`;
                cmdScript += `type NUL > "${fullPath.replace(/\//g, '\\')}\\${file}"\n`;
            });
        });
        bashScript += '\n';
        cmdScript += '\n';
    });

    return { bash: bashScript, cmd: cmdScript };
};
