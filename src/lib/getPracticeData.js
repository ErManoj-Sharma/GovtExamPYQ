import fs from 'fs';
import path from 'path';

const PRACTICE_DIR = path.join(process.cwd(), 'src/app/Constants/Practice');

function normalizeFieldNames(question) {
  const normalized = { ...question };
  
  if (normalized.Subjectname !== undefined && normalized.subject === undefined) {
    normalized.subject = normalized.Subjectname;
    delete normalized.Subjectname;
  }
  
  if (normalized['Subject name'] !== undefined && normalized.subject === undefined) {
    normalized.subject = normalized['Subject name'];
    delete normalized['Subject name'];
  }
  
  if (normalized.question_topic !== undefined) {
    if (Array.isArray(normalized.question_topic)) {
      normalized.topics = normalized.question_topic;
    } else if (typeof normalized.question_topic === 'string') {
      normalized.topics = [normalized.question_topic];
    }
  }
  
  if (normalized.options && typeof normalized.options === 'object') {
    const keys = Object.keys(normalized.options);
    if (keys.includes('E') && normalized.options.E === 'Question not attempted') {
      normalized.hasNotAttempted = true;
    }
  }
  
  return normalized;
}

export function getSubjects() {
  if (!fs.existsSync(PRACTICE_DIR)) {
    return [];
  }
  
  const folders = fs.readdirSync(PRACTICE_DIR, { withFileTypes: true });
  return folders
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

export function getTopics(subject) {
  const subjectDir = path.join(PRACTICE_DIR, subject);
  
  if (!fs.existsSync(subjectDir)) {
    return [];
  }
  
  const files = fs.readdirSync(subjectDir).filter(f => f.endsWith('.js'));
  
  return files.map(file => {
    const topicName = file.replace('.js', '');
    const filePath = path.join(subjectDir, file);
    
    try {
      const questions = require(filePath);
      const questionArray = questions.default || questions;
      
      return {
        id: topicName,
        name: formatTopicName(topicName),
        questionCount: Array.isArray(questionArray) ? questionArray.length : 0
      };
    } catch (e) {
      return {
        id: topicName,
        name: formatTopicName(topicName),
        questionCount: 0
      };
    }
  });
}

export function getQuestions(subject, topic) {
  const filePath = path.join(PRACTICE_DIR, subject, `${topic}.js`);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const questions = require(filePath);
    const questionArray = questions.default || questions;
    
    if (!Array.isArray(questionArray)) {
      return [];
    }
    
    return questionArray.map(q => normalizeFieldNames(q));
  } catch (e) {
    console.error(`Error loading questions from ${filePath}:`, e);
    return [];
  }
}

export function getSubjectStats(subject) {
  const topics = getTopics(subject);
  const totalQuestions = topics.reduce((sum, t) => sum + t.questionCount, 0);
  
  return {
    name: subject,
    topicCount: topics.length,
    questionCount: totalQuestions
  };
}

export function getAllSubjectsWithStats() {
  const subjects = getSubjects();
  return subjects.map(subject => getSubjectStats(subject));
}

function formatTopicName(topicName) {
  return topicName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/And/g, '&')
    .replace(/-/g, ' ')
    .trim();
}
