export interface Topic {
  title: string;
  timestamp?: string;
  index: number;
  files?: string;
}

export interface Section {
  title: string;
  topics: Topic[];
  index: number;
}

export type Course = Section[];

export interface StructureConfig {
  sectionDirFormat: string;
}

const cleanTitle = (title: string): string => {
  // Removes emojis, hashtags, and leading/trailing whitespace
  const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
  const hashtagRegex = /#\w+/g;
  return title.replace(emojiRegex, '').replace(hashtagRegex, '').trim();
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
    const cleanedLine = cleanTitle(line);

    if (timestampMatch) {
      if (!currentSection) {
        sectionIndex++;
        topicIndex = 0;
        currentSection = { title: `Section ${sectionIndex}`, topics: [], index: sectionIndex };
        course.push(currentSection);
      }
      topicIndex++;
      const title = cleanedLine.replace(timestampRegex, '').replace(/[-–—]/, '').trim();
      currentSection.topics.push({ title, timestamp: timestampMatch[0], index: topicIndex, files: 'notes.md' });
    } else {
      if(cleanedLine) {
        sectionIndex++;
        topicIndex = 0;
        currentSection = { title: cleanedLine, topics: [], index: sectionIndex };
        course.push(currentSection);
      }
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
    const topicDirFormat = '{index_padded}. {title}';

    course.forEach(section => {
        const sectionDir = formatName(config.sectionDirFormat, { index: section.index, title: section.title });
        bashScript += `mkdir -p "${sectionDir}"\n`;
        cmdScript += `mkdir "${sectionDir}"\n`;

        section.topics.forEach(topic => {
            const topicDir = formatName(topicDirFormat, { index: topic.index, title: topic.title, section_index: section.index, section_title: section.title });
            const fullPath = `${sectionDir}/${topicDir}`;
            bashScript += `mkdir -p "${fullPath}"\n`;
            cmdScript += `mkdir "${fullPath.replace(/\//g, '\\')}"\n`;
            
            const filesPerTopic = (topic.files || '').split(',').map(f => f.trim()).filter(Boolean);
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
