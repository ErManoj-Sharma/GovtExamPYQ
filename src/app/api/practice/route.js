import { NextResponse } from 'next/server';
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
  
  return normalized;
}

function formatTopicName(topicName) {
  if (!topicName) return 'General';
  return topicName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/And/g, '&')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .trim();
}

function getSubjectIcon(subjectName) {
  const key = subjectName.replace(/\s+/g, '');
  const icons = {
    Hindi: 'हि',
    Mathematics: '∑',
    Biology: '🧬',
    Chemistry: '⚗️',
    Physics: '⚡',
    History: '📜',
    AncientHistory: '🏛️',
    MedivalHistory: '⚔️',
    ModernHistory: '🚩',
    RajasthanHistory: '🕌',
    Geography: '🌍',
    IndianGeography: '🗺️',
    WorldGeography: '🌏',
    RajasthanGeography: '🏜️',
    Polity: '🏛️',
    StatePolity: '🪧',
    CurrentAffairs: '📰',
    Reasoning: '🧠',
    Economy: '💰',
    EconomicSurvey: '📊',
    Ecology: '🌿',
    Biotechnology: '🧫',
    ArtAndCulture: '🎨',
    ArtAndCultureofRajasthan: '🎨',
    Law: '⚖️',
    Science: '🔬',
  };
  return icons[key] || '📚';
}

async function getSubjectQuestions(subjectName) {
  const filePath = path.join(PRACTICE_DIR, `${subjectName}.js`);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonMatch = fileContent.match(/export\s+default\s+(\[[\s\S]*\]);?$/m);
    
    if (!jsonMatch) {
      console.error(`Could not parse file: ${subjectName}`);
      return [];
    }
    
    const jsonStr = jsonMatch[1];
    const questionArray = JSON.parse(`{"questions":${jsonStr}}`).questions;
    
    if (!Array.isArray(questionArray)) {
      return [];
    }
    
    return questionArray.map(q => normalizeFieldNames(q));
  } catch (e) {
    console.error(`Error loading ${subjectName}:`, e.message);
    return [];
  }
}

function getTopicsFromQuestions(questions) {
  const topicMap = new Map();
  
  questions.forEach(q => {
    const topicValue = q.question_topic;
    const topics = Array.isArray(topicValue) ? topicValue : [topicValue];
    
    topics.forEach(topic => {
      if (!topic) return;
      
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          id: topic,
          name: formatTopicName(topic),
          questionCount: 0
        });
      }
      topicMap.get(topic).questionCount++;
    });
  });
  
  return Array.from(topicMap.values());
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const topic = searchParams.get('topic');
  const sidebar = searchParams.get('sidebar');

  try {
    if (!fs.existsSync(PRACTICE_DIR)) {
      return NextResponse.json({ error: 'Practice directory not found' }, { status: 404 });
    }

    if (sidebar === 'true') {
      const files = fs.readdirSync(PRACTICE_DIR).filter(f => f.endsWith('.js'));
      
      const subjects = await Promise.all(
        files.map(async file => {
          const subjectName = file.replace('.js', '');
          const questions = await getSubjectQuestions(subjectName);
          const topics = getTopicsFromQuestions(questions);
          
          return {
            id: subjectName,
            name: subjectName,
            icon: getSubjectIcon(subjectName),
            topics: topics,
            questionCount: questions.length,
            topicCount: topics.length
          };
        })
      );

      const filteredSubjects = subjects.filter(s => s.questionCount > 0);

      return NextResponse.json({ subjects: filteredSubjects });
    }

    if (!subject) {
      const files = fs.readdirSync(PRACTICE_DIR).filter(f => f.endsWith('.js'));
      
      const subjects = await Promise.all(
        files.map(async file => {
          const subjectName = file.replace('.js', '');
          const questions = await getSubjectQuestions(subjectName);
          
          return {
            name: subjectName,
            topicCount: getTopicsFromQuestions(questions).length,
            questionCount: questions.length
          };
        })
      );

      const filteredSubjects = subjects.filter(s => s.questionCount > 0);

      return NextResponse.json({ subjects: filteredSubjects });
    }

    if (subject && !topic) {
      const questions = await getSubjectQuestions(subject);
      const topics = getTopicsFromQuestions(questions);

      return NextResponse.json({ topics });
    }

    if (subject && topic) {
      const allQuestions = await getSubjectQuestions(subject);
      const topicQuestions = allQuestions.filter(q => {
        const topicValue = q.question_topic;
        const topics = Array.isArray(topicValue) ? topicValue : [topicValue];
        return topics.includes(topic);
      });

      return NextResponse.json({ questions: topicQuestions });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
